import { StateDefinitionWhereTerm } from './term';

export type StateDefinitionWhere<Record extends StateDefinitionWhereRecord> =
  | Record
  | StateDefinitionWhereOr<Record>;

interface StateDefinitionWhereOr<Record> {
  $or: Record[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StateDefinitionWhereRecord<T = any> = {
  [K in keyof T]?: StateDefinitionWhereTerm<NonNullable<T[K]>> | null;
};

export type StateDefinitionUnique<T> = { [K in keyof T]?: T[K] };
