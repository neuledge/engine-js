import { StoreShape } from './shape';
import { StoreSortDirection } from './sort';

export interface StoreCollection {
  name: string;
  primaryKey: StorePrimaryKey;
  indexes: Record<StoreIndex['name'], StoreIndex | StorePrimaryKey>;
  fields: Record<StoreField['name'], StoreField>;
}

export type StoreCollection_Slim = Pick<StoreCollection, 'name'>;

export interface StoreField extends StoreShape {
  name: string;
  nullable?: boolean;
}

export interface StoreIndex {
  name: string;
  fields: Record<StoreField['name'], StoreIndexField>;
  unique?: boolean | 'primary';
}

export interface StorePrimaryKey extends StoreIndex {
  unique: 'primary';
  auto?: 'increment';
}

export interface StoreIndexField {
  sort: StoreSortDirection;
}
