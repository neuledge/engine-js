import { NeuledgeEngine } from '@/engine.js';
import {
  State,
  StateFilterKeys,
  StateIncludeManyKeys,
  StateIncludeOneKeys,
  StateMutationArguments,
  StateMutationsReturn,
  StateMutations,
  StateRelations,
  StateRelationState,
  StateRequireOneKeys,
} from '@/generated/index.js';
import { EntityListOffset } from '@/list.js';
import { ExecQuery } from './exec.js';
import { FilterQuery } from './filter.js';
import { LimitQuery } from './limit.js';
import { OffsetQuery } from './offset.js';
import { QueryType } from './query.js';
import { SelectManyQuery } from './select-many.js';
import { SelectOneQuery } from './select-one.js';
import { Select, SelectQuery } from './select.js';
import { UniqueQuery } from './unique.js';
import { Subset } from './utils.js';
import { UniqueWhere, Where } from './where.js';

export class QueryClass<
  T extends QueryType,
  I extends State,
  O extends State,
  K extends StateMutations<I>,
  A extends StateMutationArguments<I, K>,
> implements
    SelectQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    FilterQuery<I>,
    UniqueQuery<any, I, O, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    LimitQuery,
    OffsetQuery,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ExecQuery<any>
{
  private readonly _engine: NeuledgeEngine;
  private readonly _type: T;
  private readonly _inputStates: I[];
  private readonly _outputStates: O[];
  private readonly _action?: K;
  private readonly _args?: A[];
  private _select?: Select<O>;
  private _includeMany: {
    [K in StateIncludeManyKeys<O>]?: SelectManyQuery<
      StateRelationState<O, K>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >;
  } = {};
  private _includeOne: {
    [K in StateIncludeOneKeys<O>]?: SelectOneQuery<
      StateRelationState<O, K>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >;
  } = {};
  private _requireOne: {
    [K in StateRequireOneKeys<O>]?: SelectOneQuery<
      StateRelationState<O, K>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >;
  } = {};
  private _unique?: UniqueWhere<I>;
  private _where?: Where<I>;
  private _filter: {
    [K in StateFilterKeys<I>]?: FilterQuery<StateRelationState<I, K>>;
  } = {};
  private _limit?: number;
  private _offset?: EntityListOffset;

  constructor(
    engine: NeuledgeEngine,
    type: T,
    states: I[],
    action?: K,
    args?: A[],
  ) {
    this._engine = engine;
    this._type = type;
    this._inputStates = states;
    this._outputStates = action
      ? (QueryClass.methodReturnStates(states, action) as never)
      : (states as never);
    this._action = action;
    this._args = args;

    if (type.includes('Unique')) {
      // prevent resolve this query until unique clause provided
      // eslint-disable-next-line unicorn/no-thenable
      this.then = null as never;
    }
  }

  select<P extends Select<O>>(select?: Subset<P, Select<O>>): this {
    this._select = select;
    return this;
  }

  includeMany<
    K extends StateIncludeManyKeys<O>,
    RS extends StateRelationState<O, K>,
    RR,
  >(
    key: K,
    states?: RS[],
    query?: (query: SelectManyQuery<RS>) => SelectManyQuery<RS, RR>,
  ): this {
    let rel: SelectManyQuery<RS, RR> = new QueryClass(
      this._engine,
      this._type,
      states ?? QueryClass.relationStates(this._outputStates, key),
    );
    if (query) rel = query(rel);

    this._includeMany[key] = rel;
    return this;
  }

  includeOne<
    K extends StateIncludeOneKeys<O>,
    RS extends StateRelationState<O, K>,
    RR,
  >(
    key: K,
    states?: RS[],
    query?: (rel: SelectOneQuery<RS>) => SelectOneQuery<RS, RR>,
  ): this {
    let rel: SelectOneQuery<RS, RR> = new QueryClass(
      this._engine,
      this._type,
      states ?? QueryClass.relationStates(this._outputStates, key),
    );
    if (query) rel = query(rel);

    this._includeOne[key] = rel;
    return this;
  }

  requireOne<
    K extends StateRequireOneKeys<O>,
    RS extends StateRelationState<O, K>,
    RR,
  >(
    key: K,
    states?: RS[],
    query?: (rel: SelectOneQuery<RS>) => SelectOneQuery<RS, RR>,
  ): this {
    let rel: SelectOneQuery<RS, RR> = new QueryClass(
      this._engine,
      this._type,
      states ?? QueryClass.relationStates(this._outputStates, key),
    );
    if (query) rel = query(rel);

    this._requireOne[key] = rel;
    return this;
  }

  unique(where: UniqueWhere<I>): this {
    this._unique = where;

    // re-enable resolve for this query
    delete (this as Partial<this>).then;

    return this;
  }

  where(where: Where<I> | null): this {
    this._where = where ?? undefined;
    return this;
  }

  filter<K extends StateFilterKeys<I>, RS extends StateRelationState<I, K>>(
    key: K,
    states: RS[],
    query?: (query: FilterQuery<RS>) => FilterQuery<RS>,
  ): this {
    let rel: FilterQuery<RS> = new QueryClass(this._engine, this._type, states);
    if (query) rel = query(rel);

    this._filter[key] = rel;
    return this;
  }

  limit(limit: number | null): this {
    this._limit = limit ?? undefined;
    return this;
  }

  offset(offset: EntityListOffset | null): this {
    this._offset = offset ?? undefined;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exec(): Promise<any> {
    if (this._unique == null && this._type.includes('Unique')) {
      throw new TypeError(
        `Can't resolve a unique query without the '.unique()' clause`,
      );
    }

    // FIXME implement query.exec()
    throw new Error('Not implemented');
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

  // helpers

  private static relationStates<
    S extends State,
    K extends keyof StateRelations<S>,
  >(states: S[], key: K): StateRelationState<S, K>[] {
    return [
      ...new Set(
        // eslint-disable-next-line unicorn/prefer-spread
        ([] as StateRelationState<S, K>[]).concat(
          ...states.map((item): StateRelationState<S, K>[] => {
            const rel = QueryClass.resolveDefer(item.$relations, {})[
              key as string
            ];

            return Array.isArray(rel) && Array.isArray(rel[0])
              ? (rel[0] as StateRelationState<S, K>[])
              : ((rel ?? []) as StateRelationState<S, K>[]);
          }),
        ),
      ),
    ];
  }

  private static methodReturnStates<
    S extends State,
    K extends StateMutations<S>,
  >(states: S[], key: K): StateMutationsReturn<S, K>[] {
    return [
      ...new Set(
        // eslint-disable-next-line unicorn/prefer-spread
        ([] as StateMutationsReturn<S, K>[]).concat(
          ...states.map((item): StateMutationsReturn<S, K>[] => {
            const rel = QueryClass.resolveDefer(item.$methods, {})[
              key as string
            ];

            return (rel ?? [item]) as StateMutationsReturn<S, K>[];
          }),
        ),
      ),
    ];
  }

  private static resolveDefer<T>(
    defer: T | (() => T) | undefined | null,
    def: T,
  ): T {
    if (typeof defer === 'function') {
      return (defer as () => T)();
    }

    return defer ?? (def as T);
  }
}
