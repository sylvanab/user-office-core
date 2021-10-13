import { container, inject, injectable } from 'tsyringe';

import { Tokens } from '../config/Tokens';
import { QuestionaryDataSource } from '../datasources/QuestionaryDataSource';
import { SampleEsiDataSource } from '../datasources/SampleEsiDataSource';
import { Authorized } from '../decorators';
import { rejection, Rejection } from '../models/Rejection';
import { UserWithRole } from '../models/User';
import { CreateSampleEsiInput } from '../resolvers/mutations/CreateSampleEsiMutation';
import { DeleteSampleEsiInput } from '../resolvers/mutations/DeleteSampleEsiMutation';
import { UpdateSampleEsiArgs } from '../resolvers/mutations/UpdateSampleEsiMutation';
import { SampleDataSource } from './../datasources/SampleDataSource';
import { TemplateDataSource } from './../datasources/TemplateDataSource';
import { SampleExperimentSafetyInput } from './../models/SampleExperimentSafetyInput';
import { SampleDeclarationConfig } from './../resolvers/types/FieldConfig';
import { EsiAuthorization } from './../utils/EsiAuthorization';

@injectable()
export default class SampleEsiMutations {
  private esiAuth = container.resolve(EsiAuthorization);
  constructor(
    @inject(Tokens.SampleEsiDataSource)
    private sampleEsiDataSource: SampleEsiDataSource,
    @inject(Tokens.SampleDataSource)
    private sampleDataSource: SampleDataSource,
    @inject(Tokens.QuestionaryDataSource)
    private questionaryDataSource: QuestionaryDataSource,
    @inject(Tokens.TemplateDataSource)
    private templateDataSource: TemplateDataSource
  ) {}

  @Authorized()
  async createSampleEsi(
    user: UserWithRole | null,
    args: CreateSampleEsiInput
  ): Promise<SampleExperimentSafetyInput | Rejection> {
    const hasAccessRights = await this.esiAuth.hasWriteRights(user, args.esiId);
    if (hasAccessRights === false) {
      return rejection('User does not have permission to create sample ESI', {
        args,
      });
    }
    const sample = await this.sampleDataSource.getSample(args.sampleId);
    if (!sample) {
      return rejection('No sample found');
    }
    const question = await this.templateDataSource.getQuestion(
      sample.questionId
    ); // TODO this should be a getQuestionTemplateRelation. There is no way currently of doing it. Sample should reference QuestionRel instead of Question
    if (!question) {
      return rejection('No question found');
    }
    const templateId = (question.config as SampleDeclarationConfig)
      .esiTemplateId;
    if (!templateId) {
      return rejection('Esi template is not defined');
    }

    const newQuestionary = await this.questionaryDataSource.create(
      user!.id,
      templateId!
    );
    await this.questionaryDataSource.copyAnswers(
      sample.questionaryId,
      newQuestionary.questionaryId
    );

    return this.sampleEsiDataSource.createSampleEsi({
      ...args,
      questionaryId: newQuestionary.questionaryId,
    });
  }

  @Authorized()
  async deleteSampleEsi(
    user: UserWithRole | null,
    args: DeleteSampleEsiInput
  ): Promise<SampleExperimentSafetyInput | Rejection> {
    const hasRights = await this.esiAuth.hasWriteRights(user, args.esiId);
    if (hasRights === false) {
      return rejection(
        'User does not have permission to delete this sample ESI',
        {
          args,
        }
      );
    }

    return this.sampleEsiDataSource.deleteSampleEsi(args);
  }

  @Authorized()
  async updateSampleEsi(
    user: UserWithRole | null,
    args: UpdateSampleEsiArgs
  ): Promise<SampleExperimentSafetyInput | Rejection> {
    const hasRights = await this.esiAuth.hasWriteRights(user, args.esiId);
    if (hasRights === false) {
      return rejection(
        'User does not have permission to update this sample ESI',
        {
          args,
        }
      );
    }

    return this.sampleEsiDataSource.updateSampleEsi(args);
  }
}
