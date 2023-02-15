import { StoreCollection } from './collection';
import { StoreScalarValue, StoreSelect } from './document';
import { StoreWhere } from './where';

/**
 * A join is a set of relation conditions that must be met for a document to be
 * included in the result set with a join.
 * For each join key, the value is an array of join options. Each join option is
 * a collection and a set of conditions that must be met for a document to be
 * included in the result set. The join options are evaluated in order, and the
 * first join option that matches a document is used to include the document in
 * the result set.
 */
export type StoreJoin<T extends StoreJoinOptions = StoreJoinOptions> = Record<
  string,
  T[]
>;

/**
 * A match is a set of relation conditions that must be met for a document to be
 * included in the result set without being joined.
 * For each match key, the value is an array of match options. Each match option
 * is a collection and a set of conditions that must be met for a document to be
 * included in the result set. The match options are evaluated in order, and the
 * first match option that matches a document is used to include the document in
 * the result set.
 */
export type StoreMatch = StoreJoin<StoreMatchOptions>;

export interface StoreJoinOptions {
  collection: StoreCollection;
  by: StoreJoinBy;
  select?: StoreSelect | true | null;
  where?: StoreWhere | null;
  innerJoin?: StoreJoin | null;
  leftJoin?: StoreJoin | null;
}

export interface StoreMatchOptions extends StoreJoinOptions {
  select?: null;
  innerJoin?: StoreMatch | null;
  leftJoin?: null;
}

type FieldName = string;

/**
 * A relation by is a list of fields and values that must be matched for a
 * document to be included in the relation.
 */
export type StoreJoinBy = Record<
  FieldName,
  StoreJoinByValue | StoreJoinByField
>;

export type StoreJoinByValue = { value: StoreScalarValue; field?: never };
export type StoreJoinByField = { field: FieldName; value?: never };
