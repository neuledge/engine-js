import { StoreCollection, StoreIndex } from '@neuledge/store';
import { PostgreSQLConnection } from './connection';
import format from 'pg-format';

export const addIndex = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
  index: StoreIndex,
): Promise<void> => {
  await connection.query(
    `CREATE ${
      index.unique ? 'UNIQUE INDEX' : 'INDEX'
    } IF NOT EXISTS ${format.literal(
      `${collection.name}_${index.name}_idx`,
    )} ON ${format.literal(collection.name)} (${Object.entries(index.fields)
      .map(
        ([field, { sort }]) =>
          `${format.literal(field)} ${sort === 'desc' ? 'DESC' : 'ASC'}`,
      )
      .join(', ')})`,
  );
};
