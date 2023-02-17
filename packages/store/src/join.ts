import { StoreCollection } from './collection';
import { StoreSelect } from './document';
import { StoreScalarValue } from './value';
import { StoreWhere } from './where';

/**
 * A join is a set of relation conditions that must be met for a document to be
 * included in the result set with a join.
 * For each join key, the value is an array of join choices. Each join choice is
 * a collection and a set of conditions that must be met for a document to be
 * included in the result set. The join choices may evaluated in any order, and
 * the first join option that matches a document is used to include the document
 * in the result set. Since join choices are designed to be mutually exclusive,
 * the first join choice that matches a document should be the only join choice
 * that can matches the document, and therefore the result will be consistent.
 */
export type StoreJoin<Choice extends StoreJoinChoice = StoreJoinChoice> =
  Record<string, Choice[]>;

/**
 * A join is a set of relation conditions that must be met for a document to be
 * included in the result set with a join.
 * See {@link StoreJoin} for more details.
 */
export type StoreLeftJoin = StoreJoin<StoreLeftJoinChoice>;

export interface StoreJoinChoice {
  collection: StoreCollection;
  by: StoreJoinBy;
  select?: StoreSelect | true | null;
  where?: StoreWhere | null;
  innerJoin?: StoreJoin | null;
  leftJoin?: StoreLeftJoin | null;
}

export interface StoreLeftJoinChoice extends StoreJoinChoice {
  select: StoreSelect | true;
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
