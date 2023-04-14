import { SQLConnection, indexColumns } from '@neuledge/sql-store';
import { StoreCollection, StoreIndex } from '@neuledge/store';

// FIXME handle if not exists on mysql

export const addIndex = async (
  collection: StoreCollection,
  index: StoreIndex,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(
    `CREATE ${
      index.unique ? 'UNIQUE INDEX' : 'INDEX'
    } IF NOT EXISTS ? ON ? (${indexColumns(index)})`,
    [index.name, collection.name],
  );
};
