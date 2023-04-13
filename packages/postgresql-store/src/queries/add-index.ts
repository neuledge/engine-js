import { SQLConnection, indexColumns } from '@neuledge/sql-store';
import { StoreIndex } from '@neuledge/store';

export const addIndex = async (
  tableName: string,
  index: StoreIndex,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(
    `CREATE ${
      index.unique ? 'UNIQUE INDEX' : 'INDEX'
    } IF NOT EXISTS ? (${indexColumns(index)})`,
    [`${tableName}_${index.name}_idx`],
  );
};
