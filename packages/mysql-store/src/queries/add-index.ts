import { SQLConnection, indexColumns } from '@neuledge/sql-store';
import { StoreIndex } from '@neuledge/store';

// FIXME handle if not exists on mysql

export const addIndex = async (
  tableName: string,
  index: StoreIndex,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(
    `CREATE ${
      index.unique ? 'UNIQUE INDEX' : 'INDEX'
    } IF NOT EXISTS ? ON ? (${indexColumns(index)})`,
    [index.name, tableName],
  );
};
