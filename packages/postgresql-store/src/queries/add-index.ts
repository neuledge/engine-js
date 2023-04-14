import { SQLConnection, indexColumns } from '@neuledge/sql-store';
import { StoreCollection, StoreIndex } from '@neuledge/store';

export const addIndex = async (
  collection: StoreCollection,
  index: StoreIndex,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(
    `CREATE ${index.unique ? 'UNIQUE INDEX' : 'INDEX'} IF NOT EXISTS ${
      collection.name
    }_${index.name}_idx ON ${collection.name} (${indexColumns(index)})`,
  );
};
