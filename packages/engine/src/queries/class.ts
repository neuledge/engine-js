import {
  StateDefinition,
  StateDefinitionIncludeManyKeys,
  StateDefinitionIncludeOneKeys,
  StateDefinitionMatchKeys,
  StateDefinitionRelationState,
  StateDefinitionRequireOneKeys,
} from '@/definitions';
import { EntityListOffset } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { FilterQuery, FilterQueryOptions } from './filter';
import { LimitQuery, LimitQueryOptions } from './limit';
import { OffsetQuery, OffsetQueryOptions } from './offset';
import { QueryOptions, QueryType } from './query';
import { SortField, SortIndex, SortQueryOptions } from './sort';
import { Unique, UniqueQuery, UniqueQueryOptions } from './unique';
import { Subset } from './utils';
import { Where, WhereQuery } from './where';
import { Select, SelectQuery, SelectQueryOptions } from './select';
import { NeuledgeError } from '@/error';
import { SelectManyQuery } from './select-many';
import { SelectOneQuery } from './select-one';
import { MatchQuery } from './match';
import { IncludeQuery, IncludeQueryOptions } from './include';
import { RequireQuery, RequireQueryOptions } from './require';

export class QueryClass<
  T extends QueryType,
  I extends StateDefinition,
  O extends StateDefinition,
> implements
    SelectQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    IncludeQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    RequireQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    WhereQuery<I>,
    UniqueQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    MatchQuery<I>,
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
    (this.options as SelectQueryOptions<O>).select = select ?? true;
    return this;
  }

  includeMany<K extends StateDefinitionIncludeManyKeys<O>>(
    key: K,
    states?: StateDefinitionRelationState<O, K>[] | null,
    query?: (
      query: SelectManyQuery<StateDefinitionRelationState<O, K>>,
    ) => SelectManyQuery<StateDefinitionRelationState<O, K>, unknown>,
  ): this {
    let rel: QueryClass<
      'SelectMany',
      StateDefinitionRelationState<O, K>,
      StateDefinitionRelationState<O, K>
    > = new QueryClass({
      type: 'SelectMany',
      states,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'SelectMany',
        StateDefinitionRelationState<O, K>,
        StateDefinitionRelationState<O, K>
      >;
    }

    const options = this.options as IncludeQueryOptions<O>;

    if (!options.includeMany) {
      options.includeMany = {};
    }
    options.includeMany[key] = rel.options;

    return this;
  }

  includeOne<K extends StateDefinitionIncludeOneKeys<O>>(
    key: K,
    states?: StateDefinitionRelationState<O, K>[] | null,
    query?: (
      rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
    ) => SelectOneQuery<StateDefinitionRelationState<O, K>, unknown>,
  ): this {
    let rel: QueryClass<
      'SelectOne',
      StateDefinitionRelationState<O, K>,
      StateDefinitionRelationState<O, K>
    > = new QueryClass({
      type: 'SelectOne',
      states,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'SelectOne',
        StateDefinitionRelationState<O, K>,
        StateDefinitionRelationState<O, K>
      >;
    }

    const options = this.options as IncludeQueryOptions<O>;

    if (!options.includeOne) {
      options.includeOne = {};
    }
    options.includeOne[key] = rel.options;

    return this;
  }

  requireOne<K extends StateDefinitionRequireOneKeys<O>>(
    key: K,
    states?: StateDefinitionRelationState<O, K>[] | null,
    query?: (
      rel: SelectOneQuery<StateDefinitionRelationState<O, K>>,
    ) => SelectOneQuery<StateDefinitionRelationState<O, K>, unknown>,
  ): this {
    let rel: QueryClass<
      'SelectOne',
      StateDefinitionRelationState<O, K>,
      StateDefinitionRelationState<O, K>
    > = new QueryClass({
      type: 'SelectOne',
      states,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'SelectOne',
        StateDefinitionRelationState<O, K>,
        StateDefinitionRelationState<O, K>
      >;
    }

    const options = this.options as RequireQueryOptions<O>;

    if (!options.requireOne) {
      options.requireOne = {};
    }
    options.requireOne[key] = rel.options;

    return this;
  }

  unique(where: Unique<I>): this {
    (this.options as UniqueQueryOptions<I>).unique = where;

    // re-enable resolve for this query
    delete (this as Partial<this>).then;

    return this;
  }

  where(where: Where<I> | null): this {
    (this.options as FilterQueryOptions<I>).where = where;
    return this;
  }

  match<K extends StateDefinitionMatchKeys<I>>(
    key: K,
    states: StateDefinitionRelationState<I, K>[] | null,
    query?: (
      query: FilterQuery<StateDefinitionRelationState<I, K>>,
    ) => FilterQuery<StateDefinitionRelationState<I, K>>,
  ): this {
    let rel: QueryClass<
      'Filter',
      StateDefinitionRelationState<I, K>,
      StateDefinitionRelationState<I, K>
    > = new QueryClass({
      type: 'Filter',
      states,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'Filter',
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
    (this.options as SortQueryOptions<O>).sort = sort === '*' ? fields : sort;
    return this;
  }

  limit(limit: number | null): this {
    (this.options as LimitQueryOptions).limit = limit;
    return this;
  }

  offset(offset: EntityListOffset | null): this {
    (this.options as OffsetQueryOptions).offset = offset;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exec(): Promise<any> {
    if (!('exec' in this.options)) {
      throw new NeuledgeError(
        NeuledgeError.Code.QUERY_EXECUTION_ERROR,
        `This query is not executable`,
      );
    }

    if ('unique' in this.options && this.options.unique === true) {
      throw new NeuledgeError(
        NeuledgeError.Code.QUERY_EXECUTION_ERROR,
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
    return this.exec()
      .catch(NeuledgeError.wrap())
      .then(onfulfilled, onrejected);
  }
}
