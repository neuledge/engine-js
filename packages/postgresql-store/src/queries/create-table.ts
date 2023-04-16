import { StoreCollection } from '@neuledge/store';
import { getColumnDefinition } from './add-column';
import { addIndex } from './add-index';
import { PostgreSQLConnection } from './connection';
import format from 'pg-format';

export const createTableIfNotExists = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
): Promise<void> => {
  await connection.query(
    `CREATE TABLE IF NOT EXISTS ${format.literal(collection.name)} (
  ${Object.values(collection.fields)
    .map((field) => getColumnDefinition(field, collection))
    .join(',\n  ')},
  CONSTRAINT ${format.literal(
    `${collection.name}_pkey`,
  )} PRIMARY KEY (${Object.keys(collection.primaryKey.fields)
      .map((val) => format.literal(val))
      .join(', ')})
)`,
  );

  // add unique constraints if primary key has descending fields
  // https://stackoverflow.com/a/45604459/518153
  if (
    Object.values(collection.primaryKey.fields).some(
      (field) => field.sort === 'desc',
    )
  ) {
    await addIndex(connection, collection, collection.primaryKey);
  }
};
