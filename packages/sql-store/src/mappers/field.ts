import { StoreError, StoreField, StoreShapeType } from '@neuledge/store';

export interface SQLColumn {
  column_name: string;
  data_type: string;
  character_maximum_length: number | null;
  numeric_precision: number | null;
  numeric_scale: number | null;
  is_nullable: boolean | 1 | 0;
}

export const toStoreField = (
  dataTypeMap: Record<string, StoreShapeType>,
  column: SQLColumn,
): StoreField => {
  const type = dataTypeMap[column.data_type];
  if (!type) {
    throw new StoreError(
      StoreError.Code.NOT_SUPPORTED,
      `Unsupported data type "${column.data_type}" for column "${column.column_name}"`,
    );
  }

  return {
    name: column.column_name,
    type,
    nullable: !!column.is_nullable,
    size: column.character_maximum_length,
    precision: column.numeric_precision,
    scale: column.numeric_scale,
  };
};
