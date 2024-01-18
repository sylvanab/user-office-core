import { logger } from '@user-office-software/duo-logger';
import { OpenIdClient } from '@user-office-software/openid';
import { ValidTokenSet } from '@user-office-software/openid/lib/model/ValidTokenSet';
import { ValidUserInfo } from '@user-office-software/openid/lib/model/ValidUserInfo';
import { GraphQLError } from 'graphql';
import 'reflect-metadata';
import { UserinfoResponse } from 'openid-client';
import { container } from 'tsyringe';

import { Tokens } from '../config/Tokens';
import { AdminDataSource } from '../datasources/AdminDataSource';
import { Institution } from '../models/Institution';
import { rejection, Rejection } from '../models/Rejection';
import { SettingsId } from '../models/Settings';
import { AuthJwtPayload, User, UserRole } from '../models/User';
import { NonNullableField } from '../utils/utilTypes';
import { UserAuthorization } from './UserAuthorization';

type ValidUser = NonNullableField<
  User,
  'oidcSub' | 'oauthAccessToken' | 'oauthRefreshToken'
>;

export type PingUserInfoResponse = UserinfoResponse<{
  institution_name: string;
  institution_country: string;
  institution_ror_id: string;
}>;

export abstract class OAuthAuthorization extends UserAuthorization {
  private db = container.resolve<AdminDataSource>(Tokens.AdminDataSource);

  constructor() {
    super();

    if (OpenIdClient.hasConfig()) {
      this.initialize();
    } else {
      throw new GraphQLError(
        'OpenIdClient has no configuration. Please check your environment variables!'
      );
    }
  }
  public async externalTokenLogin(
    code: string,
    redirectUri: string
  ): Promise<User | null> {
    try {
      const { userProfile, tokenSet } = await OpenIdClient.login(
        code,
        redirectUri
      );
      const institution = await this.upsertInstitution(userProfile);
      const user = await this.upsertUser(userProfile, tokenSet, institution.id);

      return user;
    } catch (error) {
      logger.logError('Error ocurred while logging in with external token', {
        error: (error as Error)?.message,
        stack: (error as Error)?.stack,
      });

      return null;
    }
  }

  async logout(uosToken: AuthJwtPayload): Promise<string | Rejection> {
    const oidcSub = uosToken.user.oidcSub;

    if (!oidcSub) {
      return rejection('INVALID_USER');
    }

    try {
      // get and validate user form datasource
      const user = this.validateUser(
        await this.userDataSource.getByOIDCSub(oidcSub)
      );

      await OpenIdClient.logout(user.oauthAccessToken);

      return 'logged out';
    } catch (error) {
      return rejection('Error ocurred while logging out', {
        error: (error as Error)?.message,
      });
    }
  }

  public async isExternalTokenValid(code: string): Promise<boolean> {
    // No need to check external token validity, because we check UOS JWT token
    return true;
  }

  async initialize() {
    const loginUrl = await OpenIdClient.loginUrl();
    const logoutUrl = await OpenIdClient.logoutUrl();

    await this.db.updateSettings({
      settingsId: SettingsId.EXTERNAL_AUTH_LOGIN_URL,
      settingsValue: loginUrl,
    });

    await this.db.updateSettings({
      settingsId: SettingsId.EXTERNAL_AUTH_LOGOUT_URL,
      settingsValue: logoutUrl,
    });
  }

  private async upsertUser(
    userInfo: ValidUserInfo,
    tokenSet: ValidTokenSet,
    institutionId: number
  ): Promise<User> {
    const client = await OpenIdClient.getInstance();
    const userWithOAuthSubMatch = await this.userDataSource.getByOIDCSub(
      userInfo.sub
    );
    const userWithEmailMatch = await this.userDataSource.getByEmail(
      userInfo.email
    );

    const user = userWithOAuthSubMatch ?? userWithEmailMatch;

    if (user) {
      const updatedUser = await this.userDataSource.update({
        ...user,
        birthdate: userInfo.birthdate
          ? new Date(userInfo.birthdate)
          : undefined,
        department: userInfo.department as string,
        email: userInfo.email,
        firstname: userInfo.given_name,
        gender: userInfo.gender,
        lastname: userInfo.family_name,
        oauthAccessToken: tokenSet.access_token,
        oauthIssuer: client.issuer.metadata.issuer,
        oauthRefreshToken: tokenSet.refresh_token ?? '',
        oidcSub: userInfo.sub,
        organisation: institutionId,
        position: userInfo.position as string,
        preferredname: userInfo.name,
        telephone: userInfo.phone_number,
        user_title: userInfo.title as string,
      });

      return updatedUser;
    } else {
      const newUser = await this.userDataSource.create(
        'unspecified',
        userInfo.given_name,
        undefined,
        userInfo.family_name,
        userInfo.email,
        userInfo.given_name,
        userInfo.sub,
        tokenSet.access_token,
        tokenSet.refresh_token ?? '',
        client.issuer.metadata.issuer,
        'unspecified',
        1,
        new Date(),
        institutionId ?? 1,
        '',
        '',
        userInfo.email,
        '',
        undefined
      );

      await this.userDataSource.addUserRole({
        userID: newUser.id,
        roleID: UserRole.USER,
      });

      return newUser;
    }
  }

  private async upsertInstitution(
    userInfo: PingUserInfoResponse
  ): Promise<Institution> {
    let institution: Institution | null = null;
    if (userInfo.institution_ror_id) {
      const institutions = await this.adminDataSource.getInstitutions({
        rorId: userInfo.institution_ror_id,
      });
      institution = institutions?.[0] ?? null;
    }

    // If institution is not found by ROR ID, and the name is set try to find it by name
    // This is a workaround for the case when the institution is not registered in ROR
    if (!institution && userInfo.institution_name) {
      const institutions = await this.adminDataSource.getInstitutions({
        name: userInfo.institution_name,
      });
      institution = institutions?.[0] ?? null;
    }

    const shouldCreateNewInstitution = !institution;
    if (shouldCreateNewInstitution) {
      const rorApiUrl = process.env.ROR_API_URL;
      if (!rorApiUrl) {
        throw new GraphQLError('ROR_API_URL is not set');
      }
      const fetch(`rorApiUrl/organizations/${}`, {
        method: 'GET',
      });
      const countries = await this.adminDataSource.getCountries({
        name: userInfo.institution_country,
      });

      const country = countries?.[0] ?? null;

      if (!country) {
        throw new GraphQLError('Country not found', {
          extensions: { userInfo },
        });
      }

      institution = await this.adminDataSource.createInstitution({
        name: userInfo.institution,
        rorId: userInfo.institution_id,
        country: country.id,
      });

      if (!institution) {
        throw new GraphQLError('Could not create institution', {
          extensions: { userInfo },
        });
      }
    }

    return institution;
  }

  private validateUser(user: User | null): ValidUser {
    if (!user?.oidcSub || !user?.oauthAccessToken) {
      logger.logError('Invalid user', {
        authorizer: this.constructor.name,
        user,
      });
      throw new GraphQLError('Invalid user');
    }

    return user as ValidUser;
  }
}
