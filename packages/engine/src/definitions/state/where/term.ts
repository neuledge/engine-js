import { StateDefinition, StateId } from '../state';
import { ComparableFilters } from './comparable';
import { EqualableFilters } from './equalable';
import { SequenceFilters } from './sequence';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StateDefinitionWhereTerm<V = any> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>
  | SequenceFilters<V>;

export type StateDefinitionWhereId<V extends object> = EqualableFilters<V>;

export type StateDefinitionWhereNullableId<V extends object> =
  EqualableFilters<V | null>;

export type StateDefinitionWhereState<S extends StateDefinition> =
  StateDefinitionWhereId<StateId<S>>;

export type StateDefinitionWhereNullableState<S extends StateDefinition> =
  StateDefinitionWhereNullableId<StateId<S>>;

export type StateDefinitionWhereUnknown<V extends NonNullable<unknown>> =
  | EqualableFilters<V>
  | ComparableFilters<V>;

export type StateDefinitionWhereNullableUnknown<V extends object> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>;

export type StateDefinitionWhereNumber<V extends number> =
  | EqualableFilters<V>
  | ComparableFilters<V>;

export type StateDefinitionWhereNullableNumber<V extends number> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>;

export type StateDefinitionWhereEnum<V extends string> =
  | EqualableFilters<V>
  | ComparableFilters<V>;

export type StateDefinitionWhereNullableEnum<V extends string> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>;

export type StateDefinitionWhereString<V extends string> =
  | EqualableFilters<V>
  | ComparableFilters<V>
  | SequenceFilters<V>;

export type StateDefinitionWhereNullableString<V extends string> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>
  | SequenceFilters<V>;

export type StateDefinitionWhereBoolean<V extends boolean> =
  EqualableFilters<V>;

export type StateDefinitionWhereNullableBoolean<V extends boolean> =
  EqualableFilters<V | null>;

export type StateDefinitionWhereDateTime<V extends Date> =
  | EqualableFilters<V>
  | ComparableFilters<V>;

export type StateDefinitionWhereNullableDateTime<V extends Date> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>;

export type StateDefinitionWhereBuffer<V extends Buffer> =
  | EqualableFilters<V>
  | ComparableFilters<V>;

export type StateDefinitionWhereNullableBuffer<V extends Buffer> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>;

export type StateDefinitionWhereArray<V> =
  | EqualableFilters<V[]>
  | ComparableFilters<V[]>;

export type StateDefinitionWhereNullableArray<V> =
  | EqualableFilters<V[] | null>
  | ComparableFilters<V[]>;
