import { StoreCollection } from '@neuledge/store';
import { PostgreSQLConnection, encodeIdentifier } from './connection';

export const dropIndex = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
  index: string,
): Promise<void> => {
  await connection.query(
    `DROP INDEX IF EXISTS ${encodeIdentifier(
      `${collection.name}_${index}_idx`,
    )}`,
  );
};
