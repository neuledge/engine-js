import { EntityListOffset } from './list.js';
import { State, StateRelations } from './state.js';

export type Select<S extends State> = {
  [K in keyof InstanceType<S>]?: boolean;
} & {
  [K in keyof StateRelations<S>]?: StateRelations<S>[K] extends readonly [
    readonly State[],
  ]
    ?
        | SelectList<InnerSelect<StateRelations<S>[K][0][number]>>
        | (K extends keyof InstanceType<S> ? boolean : never)
    : StateRelations<S>[K] extends readonly State[]
    ?
        | InnerSelect<StateRelations<S>[K][number]>
        | (K extends keyof InstanceType<S> ? boolean : never)
    : never;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InnerSelect<S extends State, R extends S = any> = {
  $states: readonly [R, ...R[]];
} & Select<R>;

type SelectList<T> = T & {
  $limit?: number | null;
  $offset?: EntityListOffset | null;
};

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export type InnerSelect<T, S extends State = any> = {
//   $states: readonly S[];
// } & Select<T>;
