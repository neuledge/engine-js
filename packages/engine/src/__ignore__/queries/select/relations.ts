import { State, StateRelations } from '@/generated/state.js';
import { EntityList, EntityListOffset } from '@/list.js';
import { Where } from '../where.js';
import { AbstractSelectQuery } from './abstract.js';

export type SelectRelations<S extends State> = {
  [K in keyof StateRelations<S>]?: StateRelations<S>[K] extends readonly [
    readonly State[],
  ]
    ? SelectManyQuery<StateRelations<S>[K][0][number]>
    : StateRelations<S>[K] extends readonly State[]
    ? undefined extends InstanceType<S>[K]
      ? SelectOneQuery<StateRelations<S>[K][number]>
      : SelectOneOrThrowQuery<StateRelations<S>[K][number]>
    : never;
};

type SelectManyQuery<S extends State> = AbstractSelectQuery<
  S,
  Where<S>,
  number,
  EntityListOffset
>;

type SelectOneQuery<S extends State> = AbstractSelectQuery<
  S,
  Where<S>,
  1,
  null | undefined
>;

type SelectOneOrThrowQuery<S extends State> = AbstractSelectQuery<
  S,
  Where<S>,
  1,
  null | undefined
>;

export type SelectRelationState<
  S extends State,
  K extends keyof StateRelations<S>,
> = StateRelations<S>[K] extends readonly State[]
  ? StateRelations<S>[K][number]
  : StateRelations<S>[K] extends readonly [readonly State[]]
  ? StateRelations<S>[K][0][number]
  : never;

export type SelectRelationEntity<
  S extends State,
  K extends keyof StateRelations<S>,
  T,
  R,
> = Omit<T, K> &
  (StateRelations<S>[K] extends readonly [readonly State[]]
    ? { [k in K]: EntityList<R> }
    : undefined extends InstanceType<S>[K]
    ? { [k in K]?: R | null }
    : { [k in K]: R });
