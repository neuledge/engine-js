import { StoreCollection } from '@neuledge/store';
import { SQLConnection } from './connection';

export const dropColumn = async (
  collection: StoreCollection,
  field: string,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(`ALTER TABLE ? DROP COLUMN ?`, [
    collection.name,
    field,
  ]);
};
