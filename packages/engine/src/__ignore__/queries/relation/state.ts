import { State, StateRelations } from '@/generated/index.js';
import { EntityList } from '@/list.js';

export type StateRelationEntity<
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

export type StateRelationState<
  S extends State,
  K extends keyof StateRelations<S>,
> = StateRelations<S>[K] extends readonly State[]
  ? StateRelations<S>[K][number]
  : StateRelations<S>[K] extends readonly [readonly State[]]
  ? StateRelations<S>[K][0][number]
  : never;

// export type StateRelation<
//   S extends State,
//   K extends keyof StateRelations<S>,
// > = StateRelations<S>[K] extends readonly State[]
//   ? RelationQuery<StateRelations<S>[K][number], Entity<StateRelations<S>[K][number]>>
//   : StateRelations<S>[K] extends readonly [readonly State[]]
//   ? StateRelations<S>[K][0][number]
//   : never;

// type;
