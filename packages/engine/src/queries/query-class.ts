import {
  StateDefinition,
  StateDefinitionMatchKeys,
  StateDefinitionRelationState,
} from '@/definitions';
import { EntityListOffset } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { LimitQuery, LimitQueryOptions } from './limit';
import { MatchQuery } from './match';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { QueryOptions, QueryType } from './query';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { SortField, SortIndex, SortQueryOptions } from './sort';
import { UniqueQuery, UniqueQueryOptions } from './unique';
import { Subset } from './utils';
import { UniqueWhere, Where } from './where';
import { Select } from './select';

export class QueryClass<
  T extends QueryType,
  I extends StateDefinition,
  O extends StateDefinition,
> implements
    RetriveQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    FilterQuery<I>,
    UniqueQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    LimitQuery,
    OffsetQuery,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ExecQuery<any>
{
  constructor(private readonly options: QueryOptions<T, I, O>) {
    if ('unique' in options && options.unique === true) {
      // prevent resolve this query until unique clause provided
      // eslint-disable-next-line unicorn/no-thenable
      this.then = null as never;
    }
  }

  select<P extends Select<O>>(select?: Subset<P, Select<O>>): this {
    (this.options as RetriveQueryOptions<O>).select = select;
    return this;
  }

  //   includeMany<K extends StateDefinitionIncludeManyKeys<O>>(
  //     key: K,
  //     states?: StateDefinitionRelationState<O, K>[] | null,
  //     query?: (
  //       query: SelectManyQuery<StateDefinitionRelationState<O, K>>,
  //     ) => SelectManyQuery<StateDefinitionRelationState<O, K>, unknown>,
  //   ): this {
  //     let rel: QueryClass<
  //       'SelectMany',
  //       StateDefinitionRelationState<O, K>,
  //       StateDefinitionRelationState<O, K>
  //     > = new QueryClass({
  //       type: 'SelectMany',
  //       states: states ?? undefined,
  //     });
  //
  //     if (query) {
  //       rel = query(rel) as QueryClass<
  //         'SelectMany',
  //         StateDefinitionRelationState<O, K>,
  //         StateDefinitionRelationState<O, K>
  //       >;
  //     }
  //
  //     const options = this.options as RetriveQueryOptions<O>;
  //
  //     if (!options.includeMany) {
  //       options.includeMany = {};
  //     }
  //     options.includeMany[key] = rel.options;
  //
  //     return this;
  //   }

  //   includeOne<K extends StateDefinitionIncludeOneKeys<O>>(
  //     key: K,
  //     states?: StateDefinitionRelationState<O, K>[] | null,
  //     query?: (
  //       rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
  //     ) => SelectOneQuery<StateDefinitionRelationState<O, K>, unknown>,
  //   ): this {
  //     let rel: QueryClass<
  //       'SelectOne',
  //       StateDefinitionRelationState<O, K>,
  //       StateDefinitionRelationState<O, K>
  //     > = new QueryClass({
  //       type: 'SelectOne',
  //       states: states ?? undefined,
  //     });
  //
  //     if (query) {
  //       rel = query(rel) as QueryClass<
  //         'SelectOne',
  //         StateDefinitionRelationState<O, K>,
  //         StateDefinitionRelationState<O, K>
  //       >;
  //     }
  //
  //     const options = this.options as RetriveQueryOptions<O>;
  //
  //     if (!options.includeOne) {
  //       options.includeOne = {};
  //     }
  //     options.includeOne[key] = rel.options;
  //
  //     return this;
  //   }

  //   requireOne<K extends StateDefinitionRequireOneKeys<O>>(
  //     key: K,
  //     states?: StateDefinitionRelationState<O, K>[] | null,
  //     query?: (
  //       rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
  //     ) => SelectOneQuery<StateDefinitionRelationState<O, K>, unknown>,
  //   ): this {
  //     let rel: QueryClass<
  //       'SelectOne',
  //       StateDefinitionRelationState<O, K>,
  //       StateDefinitionRelationState<O, K>
  //     > = new QueryClass({
  //       type: 'SelectOne',
  //       states: states ?? undefined,
  //     });
  //
  //     if (query) {
  //       rel = query(rel) as QueryClass<
  //         'SelectOne',
  //         StateDefinitionRelationState<O, K>,
  //         StateDefinitionRelationState<O, K>
  //       >;
  //     }
  //
  //     const options = this.options as RetriveQueryOptions<O>;
  //
  //     if (!options.requireOne) {
  //       options.requireOne = {};
  //     }
  //     options.requireOne[key] = rel.options;
  //
  //     return this;
  //   }

  unique(where: UniqueWhere<I>): this {
    (this.options as UniqueQueryOptions<I>).unique = where;

    // re-enable resolve for this query
    delete (this as Partial<this>).then;

    return this;
  }

  where(where: Where<I> | null): this {
    (this.options as FilterQueryOptions<I>).where = where ?? undefined;
    return this;
  }

  match<K extends StateDefinitionMatchKeys<I>>(
    key: K,
    states: StateDefinitionRelationState<I, K>[] | null,
    query?: (
      query: MatchQuery<StateDefinitionRelationState<I, K>>,
    ) => MatchQuery<StateDefinitionRelationState<I, K>>,
  ): this {
    let rel: QueryClass<
      'Match',
      StateDefinitionRelationState<I, K>,
      StateDefinitionRelationState<I, K>
    > = new QueryClass({
      type: 'Match',
      states: states ?? undefined,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'Match',
        StateDefinitionRelationState<I, K>,
        StateDefinitionRelationState<I, K>
      >;
    }

    const options = this.options as FilterQueryOptions<I>;

    if (!options.match) {
      options.match = {};
    }
    options.match[key] = rel.options;

    return this;
  }

  sort(sort: '*' | SortIndex<O> | null, ...fields: SortField<O>[]): this {
    (this.options as SortQueryOptions<O>).sort =
      sort === '*' ? fields : sort ?? undefined;
    return this;
  }

  limit(limit: number | null): this {
    (this.options as LimitQueryOptions).limit = limit ?? undefined;
    return this;
  }

  offset(offset: EntityListOffset | null): this {
    (this.options as OffsetQueryOptions).offset = offset ?? undefined;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exec(): Promise<any> {
    if (!('exec' in this.options)) {
      throw new TypeError(`This query is not executable`);
    }

    if ('unique' in this.options && this.options.unique === true) {
      throw new TypeError(
        `Can't resolve a unique query without the '.unique()' clause`,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.options as ExecQueryOptions<any, any, any>).exec(this.options);
  }

  // eslint-disable-next-line unicorn/no-thenable, @typescript-eslint/no-explicit-any
  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((value: any) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    return this.exec().then(onfulfilled, onrejected);
  }
}
