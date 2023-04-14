import { SQLConnection } from '@neuledge/sql-store';
import { StoreCollection, StoreField } from '@neuledge/store';

export const addColumn = async (
  collection: StoreCollection,
  field: StoreField,
  connection: SQLConnection,
): Promise<void> => {};
