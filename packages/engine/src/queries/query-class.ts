import {
  State,
  StateMatchKeys,
  StateIncludeManyKeys,
  StateIncludeOneKeys,
  StateRelationState,
  StateRequireOneKeys,
} from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { FilterQuery, FilterQueryOptions } from './filter.js';
import { LimitQuery, LimitQueryOptions } from './limit.js';
import { MatchQuery } from './match.js';
import { OffsetQuery, OffsetQueryOptions } from './offset.js';
import { QueryOptions, QueryType } from './query.js';
import { SelectManyQuery } from './select-many.js';
import { SelectOneQuery } from './select-one.js';
import { Select, SelectQuery, SelectQueryOptions } from './select.js';
import { SortField, SortIndex, SortQueryOptions } from './sort.js';
import { UniqueQuery, UniqueQueryOptions } from './unique.js';
import { Subset } from './utils.js';
import { UniqueWhere, Where } from './where.js';

export class QueryClass<
  T extends QueryType,
  I extends State,
  O extends State,
> implements
    SelectQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
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
    (this.options as SelectQueryOptions<O>).select = select;
    return this;
  }

  includeMany<K extends StateIncludeManyKeys<O>>(
    key: K,
    states?: StateRelationState<O, K>[] | null,
    query?: (
      query: SelectManyQuery<StateRelationState<O, K>>,
    ) => SelectManyQuery<StateRelationState<O, K>, unknown>,
  ): this {
    let rel: QueryClass<
      'SelectMany',
      StateRelationState<O, K>,
      StateRelationState<O, K>
    > = new QueryClass({
      type: 'SelectMany',
      states: states ?? undefined,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'SelectMany',
        StateRelationState<O, K>,
        StateRelationState<O, K>
      >;
    }

    const options = this.options as SelectQueryOptions<O>;

    if (!options.includeMany) {
      options.includeMany = {};
    }
    options.includeMany[key] = rel.options;

    return this;
  }

  includeOne<K extends StateIncludeOneKeys<O>>(
    key: K,
    states?: StateRelationState<O, K>[] | null,
    query?: (
      rel: SelectOneQuery<StateRelationState<O, K>>,
    ) => SelectOneQuery<StateRelationState<O, K>, unknown>,
  ): this {
    let rel: QueryClass<
      'SelectOne',
      StateRelationState<O, K>,
      StateRelationState<O, K>
    > = new QueryClass({
      type: 'SelectOne',
      states: states ?? undefined,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'SelectOne',
        StateRelationState<O, K>,
        StateRelationState<O, K>
      >;
    }

    const options = this.options as SelectQueryOptions<O>;

    if (!options.includeOne) {
      options.includeOne = {};
    }
    options.includeOne[key] = rel.options;

    return this;
  }

  requireOne<K extends StateRequireOneKeys<O>>(
    key: K,
    states?: StateRelationState<O, K>[] | null,
    query?: (
      rel: SelectOneQuery<StateRelationState<O, K>>,
    ) => SelectOneQuery<StateRelationState<O, K>, unknown>,
  ): this {
    let rel: QueryClass<
      'SelectOne',
      StateRelationState<O, K>,
      StateRelationState<O, K>
    > = new QueryClass({
      type: 'SelectOne',
      states: states ?? undefined,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'SelectOne',
        StateRelationState<O, K>,
        StateRelationState<O, K>
      >;
    }

    const options = this.options as SelectQueryOptions<O>;

    if (!options.requireOne) {
      options.requireOne = {};
    }
    options.requireOne[key] = rel.options;

    return this;
  }

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

  match<K extends StateMatchKeys<I>>(
    key: K,
    states: StateRelationState<I, K>[] | null,
    query?: (
      query: MatchQuery<StateRelationState<I, K>>,
    ) => MatchQuery<StateRelationState<I, K>>,
  ): this {
    let rel: QueryClass<
      'Match',
      StateRelationState<I, K>,
      StateRelationState<I, K>
    > = new QueryClass({
      type: 'Match',
      states: states ?? undefined,
    });

    if (query) {
      rel = query(rel) as QueryClass<
        'Match',
        StateRelationState<I, K>,
        StateRelationState<I, K>
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
