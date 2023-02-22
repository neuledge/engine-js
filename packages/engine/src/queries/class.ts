import {
  StateAllRelations,
  StateDefinition,
  StateOneRelations,
  StateRelationStates,
} from '@/definitions';
import { EntityListOffset } from '@/list';
import {
  ExecQuery,
  ExecQueryOptions,
  ExpandQuery,
  ExpandQueryOptions,
  ExpandQueryParam,
  RefineQueryOptions,
  LimitQuery,
  LimitQueryOptions,
  MatchQuery,
  MatchQueryParam,
  OffsetQuery,
  OffsetQueryOptions,
  PopulateOneQueryParam,
  PopulateQuery,
  PopulateQueryOptions,
  Return,
  ReturnQuery,
  ReturnQueryOptions,
  Select,
  SelectParam,
  SelectQuery,
  SelectQueryOptions,
  SortField,
  SortIndex,
  SortQueryOptions,
  Unique,
  UniqueQuery,
  UniqueQueryOptions,
  Where,
  WhereQuery,
  Filter,
  FilterQueryOptions,
  FilterQuery,
  WhereQueryOptions,
} from './raw';
import { QueryOptions, QueryType } from './query';
import { NeuledgeError } from '@/error';

export class QueryClass<
  T extends QueryType,
  I extends StateDefinition,
  O extends StateDefinition,
> implements
    ReturnQuery<any, I, O>, // eslint-disable-line @typescript-eslint/no-explicit-any
    SelectQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    ExpandQuery<any, I, O, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    PopulateQuery<any, I, O, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    WhereQuery<I>,
    UniqueQuery<any, I, O, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    FilterQuery<I>,
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

  return(returns?: Return) {
    (this.options as ReturnQueryOptions).returns = returns ?? 'new';
    (this.options as SelectQueryOptions<O>).select = true;

    return this;
  }

  select<P extends Select<O>>(select?: SelectParam<O, P> | true): this {
    (this.options as SelectQueryOptions<O>).select = select ?? true;
    return this;
  }

  expand<K extends StateOneRelations<O>>(
    key: K,
    states?:
      | StateRelationStates<O, K>[]
      | ExpandQueryParam<StateRelationStates<O, K>>,
    query?: ExpandQueryParam<StateRelationStates<O, K>>,
  ): this {
    if (states !== undefined && !Array.isArray(states)) {
      query = states;
      states = undefined;
    }

    let rel = new QueryClass<
      'SelectOne',
      StateRelationStates<O, K>,
      StateRelationStates<O, K>
    >({
      type: 'SelectOne',
      states,
    });

    if (query) {
      rel = query(rel) as typeof rel;
    } else {
      rel.select();
    }

    const options = this.options as ExpandQueryOptions<O>;

    if (!options.expand) {
      options.expand = {};
    }
    options.expand[key] = rel.options;

    return this;
  }

  populateOne<K extends StateOneRelations<O>>(
    key: K,
    states?:
      | StateRelationStates<O, K>[]
      | PopulateOneQueryParam<StateRelationStates<O, K>>,
    query?: PopulateOneQueryParam<StateRelationStates<O, K>>,
  ): this {
    if (states !== undefined && !Array.isArray(states)) {
      query = states;
      states = undefined;
    }

    let rel = new QueryClass<
      'SelectOne',
      StateRelationStates<O, K>,
      StateRelationStates<O, K>
    >({
      type: 'SelectOne',
      select: true,
      states,
    });

    if (query) {
      rel = query(rel) as typeof rel;
    }

    const options = this.options as PopulateQueryOptions<O>;

    if (!options.populateOne) {
      options.populateOne = {};
    }
    options.populateOne[key] = rel.options;

    return this;
  }

  //   populateMany<K extends StateManyRelations<O>>(
  //     key: K,
  //     states?:
  //       | StateRelationStates<O, K>[]
  //       | PopulateManyQueryParam<StateRelationStates<O, K>>,
  //     query?: PopulateManyQueryParam<StateRelationStates<O, K>>,
  //   ): this {
  //     if (states !== undefined && !Array.isArray(states)) {
  //       query = states;
  //       states = undefined;
  //     }
  //
  //     let rel = new QueryClass<
  //       'SelectMany',
  //       StateRelationStates<O, K>,
  //       StateRelationStates<O, K>
  //     >({
  //       type: 'SelectMany',
  //       select: true,
  //       states,
  //     });
  //
  //     if (query) {
  //       rel = query(rel) as typeof rel;
  //     }
  //
  //     const options = this.options as PopulateQueryOptions<O>;
  //
  //     if (!options.populateMany) {
  //       options.populateMany = {};
  //     }
  //     options.populateMany[key] = rel.options;
  //
  //     return this;
  //   }

  where(where: Where<I> | null): this {
    (this.options as WhereQueryOptions<I>).where = where;
    return this;
  }

  unique(where: Unique<I>): this {
    (this.options as UniqueQueryOptions<I>).unique = where;

    // re-enable resolve for this query
    delete (this as Partial<this>).then;

    return this;
  }

  filter(filter: Filter<I> | null): this {
    (this.options as FilterQueryOptions<I>).filter = filter;
    return this;
  }

  match<K extends StateAllRelations<I>>(
    key: K,
    states?:
      | StateRelationStates<I, K>[]
      | MatchQueryParam<StateRelationStates<I, K>>,
    query?: MatchQueryParam<StateRelationStates<I, K>>,
  ): this {
    if (states !== undefined && !Array.isArray(states)) {
      query = states;
      states = undefined;
    }

    let rel: QueryClass<
      'Refine',
      StateRelationStates<I, K>,
      StateRelationStates<I, K>
    > = new QueryClass({
      type: 'Refine',
      states,
    });

    if (query) {
      rel = query(rel) as typeof rel;
    }

    const options = this.options as RefineQueryOptions<I>;

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
