import { StoreCollection } from '@neuledge/store';
import { SQLConnection } from './connection';

export const dropIndex = async (
  collection: StoreCollection,
  index: string,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(`DROP INDEX ? ON ?`, [index, collection.name]);
};
