import { Query, Ctx, Resolver, InputType, Field, Arg } from 'type-graphql';

import { ResolverContext } from '../../context';
import { Entry } from '../types/Entry';

@InputType()
export class CountriesFilter {
  @Field(() => String, { nullable: true })
  public name?: string;
}

@Resolver()
export class CountriesQuery {
  @Query(() => [Entry], { nullable: true })
  countries(
    @Ctx() context: ResolverContext,
    @Arg('filter', () => CountriesFilter, { nullable: true })
    filter: CountriesFilter
  ) {
    return context.queries.admin.getCountries(filter);
  }
}
