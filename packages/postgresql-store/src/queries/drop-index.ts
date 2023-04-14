import { StoreCollection } from '@neuledge/store';
import { SQLConnection } from '@neuledge/sql-store';

export const dropIndex = async (
  collection: StoreCollection,
  index: string,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(`DROP INDEX IF EXISTS ?`, [
    `${collection.name}_${index}_idx`,
  ]);
};
