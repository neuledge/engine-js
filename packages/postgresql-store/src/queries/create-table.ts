import { SQLConnection } from '@neuledge/sql-store';
import { StoreCollection } from '@neuledge/store';
import { getColumnDefinition } from './add-column';

export const createTableIfNotExists = async (
  collection: StoreCollection,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(
    `CREATE TABLE IF NOT EXISTS ${collection.name} (
  ${Object.values(collection.fields)
    .map((field) => getColumnDefinition(field, collection))
    .join(',\n  ')},
  CONSTRAINT ${collection.name}_pkey PRIMARY KEY (${Object.keys(
      collection.primaryKey.fields,
    ).join(', ')})
)`,
  );

  // FIXME add unique constraints if primary key has descending fields
  // https://stackoverflow.com/a/45604459/518153
};
