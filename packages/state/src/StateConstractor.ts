export interface StateConstractor<T> {
  readonly $$PrimaryKeys: readonly (keyof T)[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}
