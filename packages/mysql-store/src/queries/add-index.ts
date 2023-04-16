import { StoreCollection, StoreIndex } from '@neuledge/store';
import { MySQLConnection } from './connection';

export const addIndex = async (
  connection: MySQLConnection,
  collection: StoreCollection,
  index: StoreIndex,
): Promise<void> => {};
