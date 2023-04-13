import { SQLConnection } from '@neuledge/sql-store';
import { StoreCollection } from '@neuledge/store';

// FIXME handle if not exists on mysql

export const createTableIfNotExists = async (
  collection: StoreCollection,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(
    `CREATE TABLE IF NOT EXISTS ? (
        ${/* FIXME add columns */ ''}
        )`,
    [collection.name],
  );
};
