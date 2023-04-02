import { StoreCollection_Slim } from '@neuledge/store';

export interface SQLTable {
  table_name: string;
}

export const toStoreCollection_Slim = (
  table: SQLTable,
): StoreCollection_Slim => ({
  name: table.table_name,
});
