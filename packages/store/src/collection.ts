import { StoreSortDirection } from './sort';

export interface StoreCollection {
  name: string;
  primaryKey: StorePrimaryKey;
  indexes: Record<StoreIndex['name'], StoreIndex>;
  fields: Record<StoreField['name'], StoreField>;
}

export type StoreCollection_Slim = Pick<StoreCollection, 'name'>;

export interface StoreField {
  name: string;
  type: StoreFieldType;
  size?: number;
  values?: string[];
  nullable?: boolean;
}

export type StoreFieldType =
  | 'string'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'float32'
  | 'float64'
  | 'bigint'
  | 'boolean'
  | 'binary'
  | 'enum'
  | 'json';

export interface StoreIndex {
  name: string;
  fields: StoreIndexField[];
  unique?: boolean;
  primary?: boolean;
}

export interface StorePrimaryKey extends StoreIndex {
  primary: true;
}

export interface StoreIndexField {
  field: StoreField;
  order: StoreSortDirection;
}
