export type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};

/**
 * merging types to plain types
 * https://dev.to/lucianbc/union-type-merging-in-typescript-9al
 */
export type Merge<T extends object> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>;
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
};

export type AllKeys<T> = T extends any ? keyof T : never; // eslint-disable-line @typescript-eslint/no-explicit-any

// type Merge2<T extends object> = {
//   [k in AllKeys<T>]: PickType<T, k>;
// };

type CommonKeys<T extends object> = keyof T;
type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>;
type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any } // eslint-disable-line @typescript-eslint/no-explicit-any
  ? T[K]
  : undefined;
type PickTypeOf<T, K extends string | number | symbol> = K extends AllKeys<T>
  ? PickType<T, K>
  : never;
