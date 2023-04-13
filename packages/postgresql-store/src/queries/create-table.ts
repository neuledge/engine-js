import { SQLConnection, indexColumns } from '@neuledge/sql-store';
import { StoreCollection } from '@neuledge/store';

export const createTableIfNotExists = async (
  collection: StoreCollection,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(
    `CREATE TABLE IF NOT EXISTS ? (
        ${/* FIXME add columns */ ''}
        CONSTRAINT ? PRIMARY KEY (${indexColumns(collection.primaryKey)})
        )`,
    [collection.name],
  );
};
