// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StateDefinitionWhere<T = any> =
  | StateDefinitionWhereRecord<T>
  | StateDefinitionWhereOr<T>;

interface StateDefinitionWhereOr<T> {
  $or: StateDefinitionWhereRecord<T>[];
}

export type StateDefinitionWhereRecord<T> = {
  [K in keyof T]?: T[K];
};

export type StateDefinitionUnique<T> = { [K in keyof T]?: T[K] };
