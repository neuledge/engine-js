import { StoreCollection } from '@neuledge/store';
import { MySQLConnection } from './connection';

export const createTableIfNotExists = async (
  connection: MySQLConnection,
  collection: StoreCollection,
): Promise<void> => {};
