import { StoreCollection, StoreField } from '@neuledge/store';
import { MySQLConnection } from './connection';

export const addColumn = async (
  connection: MySQLConnection,
  collection: StoreCollection,
  field: StoreField,
): Promise<void> => {};
