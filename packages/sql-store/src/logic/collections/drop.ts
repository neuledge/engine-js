import { StoreDropCollectionOptions } from '@neuledge/store';

export interface DropCollectionQueries<Connection> {
  dropTableIfExists(connection: Connection, name: string): Promise<void>;
}

export const dropCollection = async <Connection>(
  options: StoreDropCollectionOptions,
  connection: Connection,
  { dropTableIfExists }: DropCollectionQueries<Connection>,
): Promise<void> => {
  await dropTableIfExists(connection, options.collection.name);
};
