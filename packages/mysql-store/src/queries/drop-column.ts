import { StoreCollection } from '@neuledge/store';
import { MySQLConnection } from './connection';

export const dropColumn = async (
  connection: MySQLConnection,
  collection: StoreCollection,
  field: string,
): Promise<void> => {};
