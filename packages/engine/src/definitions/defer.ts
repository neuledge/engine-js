export type Defer<T> = (() => T) | T;
export type Deferred<T, N = never> = T extends Defer<infer R> ? R : N;

export const resolveDefer: {
  <T>(defer: Defer<T>): T;
  <T>(defer: Defer<T> | undefined | null, def: T): T;
} = <T>(defer: Defer<T> | undefined | null, def?: T): T => {
  if (typeof defer === 'function') {
    return (defer as () => T)();
  }

  return defer ?? (def as T);
};
