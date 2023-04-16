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
    } IF NOT EXISTS ${format.ident(
      `${collection.name}_${index.name}_idx`,
    )} ON ${format.ident(collection.name)} (${Object.entries(index.fields)
      .map(
        ([field, { sort }]) =>
          `${format.ident(field)} ${sort === 'desc' ? 'DESC' : 'ASC'}`,
      )
      .join(', ')})`,
  );
};
