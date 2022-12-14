import { StoreCollectionName } from './collection';
import { StoreScalarValue } from './document';
import { StoreWhere } from './where';

export type StoreMatch = Record<string, StoreMatchOptions[]>;

// export type StoreRequireFirst = Record<string, StoreRequireOptions[]>;
// export type StoreIncludeFirst = Record<string, StoreRequireOptions[]>;
// export type StoreIncludeMany = Record<string, StoreIncludeOptions[]>;

export interface StoreMatchOptions {
  collectionName: StoreCollectionName;
  by: StoreMatchBy;
  where?: StoreWhere;
  match?: StoreMatch;
}

// export interface StoreRequireOptions extends StoreMatchOptions {
//   select?: StoreSelect;
//   requireFirst?: StoreRequireFirst;
//   includeFirst?: StoreIncludeFirst;
//   includeMany?: StoreIncludeMany;
//   offset?: StoreListOffset;
// }
//
// export interface StoreIncludeOptions extends StoreRequireOptions {
//   limit: number;
// }

type FieldName = string;
export type StoreMatchBy = Record<
  FieldName,
  FieldName | { $value: StoreScalarValue }
>;
