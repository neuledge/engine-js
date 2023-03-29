import { StoreCollection_Slim } from '@neuledge/store';
import { SQLTable } from '@/queries';

export const toStoreCollection_Slim = (
  table: SQLTable,
): StoreCollection_Slim => ({
  name: table.table_name,
});
