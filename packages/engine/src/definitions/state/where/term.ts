import { StateDefinition, StateDefinitionId } from '../state';
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
  StateDefinitionWhereId<StateDefinitionId<S>>;

export type StateDefinitionWhereNullableState<S extends StateDefinition> =
  StateDefinitionWhereNullableId<StateDefinitionId<S>>;

export type StateDefinitionWhereObject<V extends object> =
  | EqualableFilters<V>
  | ComparableFilters<V>;

export type StateDefinitionWhereNullableObject<V extends object> =
  | EqualableFilters<V | null>
  | ComparableFilters<V>;

export type StateDefinitionWhereNumber<V extends number> =
  | EqualableFilters<V>
  | ComparableFilters<V>;

export type StateDefinitionWhereNullableNumber<V extends number> =
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
