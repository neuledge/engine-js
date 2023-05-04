import { StoreCollection, StoreIndex } from '@neuledge/store';
import { PostgreSQLConnection, encodeIdentifier } from './connection';

export const addIndex = async (
  connection: PostgreSQLConnection,
  collection: StoreCollection,
  index: StoreIndex,
): Promise<void> => {
  await connection.query(
    `CREATE ${
      index.unique ? 'UNIQUE INDEX' : 'INDEX'
    } IF NOT EXISTS ${encodeIdentifier(
      `${collection.name}_${index.name}_idx`,
    )} ON ${encodeIdentifier(collection.name)} (${Object.entries(index.fields)
      .map(
        ([field, { sort }]) =>
          `${encodeIdentifier(field)} ${sort === 'desc' ? 'DESC' : 'ASC'}`,
      )
      .join(', ')})`,
  );
};
