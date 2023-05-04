import { StoreCollection } from '@neuledge/store';
import { PostgreSQLConnection, encodeIdentifier } from './connection';

export const dropColumn = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
  field: string,
): Promise<void> => {
  await connection.query(
    `ALTER TABLE ${encodeIdentifier(
      collection.name,
    )} DROP COLUMN ${encodeIdentifier(field)}`,
  );
};
