import { StoreCollection } from '@neuledge/store';
import { PostgreSQLConnection } from './connection';
import format from 'pg-format';

export const dropColumn = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
  field: string,
): Promise<void> => {
  await connection.query(
    `ALTER TABLE ${format.literal(
      collection.name,
    )} DROP COLUMN ${format.literal(field)}`,
  );
};
