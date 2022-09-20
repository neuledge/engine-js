import { State } from './state.js';
import { AllKeys } from './utils.js';

export type Where<S extends State> = S['Query'] & {
  [K in ForbiddenQueryKeys<S>]?: never;
};

export type UniqueWhere<S extends State> = S['UniqueQuery'] & {
  [K in ForbiddenUniqueKeys<S>]?: never;
};

// {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   [K in UniqueKeys<S>]: S['UniqueQuery'] extends { [k in K]?: any }
//     ? S['UniqueQuery'][K]
//     : never;
// };
//
// type UniqueKeys<S extends State> = {
//   [K in S['key']]: S extends { key: K } ? keyof S['UniqueQuery'] : never;
// }[S['key']];
//
// type ttt = AllKeys<{ id: number } | { email: string }>;
//
// type fff = [{ id: number } | { email: string }, { id: number }][number];

type ForbiddenUniqueKeys<S extends State> = {
  [K in S['key']]: Exclude<
    AllKeys<S['UniqueQuery']>,
    S extends { key: K } ? AllKeys<S['UniqueQuery']> : never
  >;
}[S['key']];

type ForbiddenQueryKeys<S extends State> = {
  [K in S['key']]: Exclude<
    AllKeys<S['Query']>,
    S extends { key: K } ? AllKeys<S['Query']> : never
  >;
}[S['key']];
