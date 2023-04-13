import { SQLConnection, dropTableIfExists } from '@/queries';
import { StoreDropCollectionOptions } from '@neuledge/store';

export const dropCollection = async (
  options: StoreDropCollectionOptions,
  connection: SQLConnection,
): Promise<void> => {
  await dropTableIfExists(connection, options.collection.name);
};
