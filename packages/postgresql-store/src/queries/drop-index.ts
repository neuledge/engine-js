import { StoreCollection } from '@neuledge/store';
import { PostgreSQLConnection } from './connection';
import format from 'pg-format';

export const dropIndex = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
  index: string,
): Promise<void> => {
  await connection.query(
    `DROP INDEX IF EXISTS ${format.ident(`${collection.name}_${index}_idx`)}`,
  );
};
