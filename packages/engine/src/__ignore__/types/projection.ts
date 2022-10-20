import { EntityList } from './list.js';
import { Select } from './select.js';
import { State, StateEntity, StateKey, StateRelations } from './state.js';

// export type Projection<S extends State> = {
//   [K in keyof InstanceType<S>]?: InstanceType<S>[K];
// };

export type ProjectedEntity<S extends State, P extends Select<S>> = {
  [K in StateKey<S>]: S extends State<K> ? Project<S, P & Select<S>> : never;
}[StateKey<S>];

type Project<S extends State, P extends Select<S>> = StateEntity<
  S,
  {
    [K in TruthyKeys<S, P>]: InstanceType<S>[K];
  } & {
    [K in BooleanKeys<S, P>]?: InstanceType<S>[K] | null;
  } & {
    [K in NestedKeys<S, P>]: StateRelations<S>[K] extends readonly [
      readonly State[],
    ]
      ? EntityList<
          ProjectedEntity<
            StateRelations<S>[K][0][number],
            P[K] & Select<StateRelations<S>[K][0][number]>
          >
        >
      : StateRelations<S>[K] extends readonly State[]
      ? ProjectedEntity<
          StateRelations<S>[K][number],
          P[K] & Select<StateRelations<S>[K][number]>
        >
      : never;
  }
>;

type TruthyKeys<S extends State, P extends Select<S>> = {
  [K in keyof InstanceType<S>]: P[K] extends true
    ? undefined extends InstanceType<S>[K]
      ? never
      : K
    : never;
}[keyof InstanceType<S>];

type BooleanKeys<S extends State, P extends Select<S>> = {
  [K in keyof InstanceType<S>]: P[K] extends false
    ? never
    : P[K] extends boolean
    ? K
    : never;
}[keyof InstanceType<S>];

type NestedKeys<S extends State, P extends Select<S>> = {
  [K in keyof StateRelations<S>]: P[K] extends object ? K : never;
}[keyof (keyof StateRelations<S>)];
