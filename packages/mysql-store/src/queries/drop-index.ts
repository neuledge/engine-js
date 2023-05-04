import { StoreCollection } from '@neuledge/store';
import { MySQLConnection } from './connection';

export const dropIndex = async (
  connection: MySQLConnection,
  collection: StoreCollection,
  index: string,
): Promise<void> => {};
