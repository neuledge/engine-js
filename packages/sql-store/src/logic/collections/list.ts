import { SQLTable, toStoreCollection_Slim } from '@/mappers';
import { SQLConnection } from '@/queries';
import { StoreCollection_Slim } from '@neuledge/store';

export interface ListCollectionsQueries {
  listTables: (connection: SQLConnection) => Promise<SQLTable[]>;
}

export const listCollections = async (
  connection: SQLConnection,
  { listTables }: ListCollectionsQueries,
): Promise<StoreCollection_Slim[]> => {
  const tables = await listTables(connection);
  return tables.map((table) => toStoreCollection_Slim(table));
};
