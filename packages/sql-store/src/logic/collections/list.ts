import { SQLTable, toStoreCollection_Slim } from '@/mappers';
import { StoreCollection_Slim } from '@neuledge/store';

export interface ListCollectionsQueries<Connection> {
  listTables(connection: Connection): Promise<SQLTable[]>;
}

export const listCollections = async <Connection>(
  connection: Connection,
  { listTables }: ListCollectionsQueries<Connection>,
): Promise<StoreCollection_Slim[]> => {
  const tables = await listTables(connection);
  return tables.map((table) => toStoreCollection_Slim(table));
};
