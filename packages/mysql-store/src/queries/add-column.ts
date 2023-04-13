import { SQLConnection } from '@neuledge/sql-store';
import { StoreField } from '@neuledge/store';

export const addColumn = async (
  tableName: string,
  field: StoreField,
  connection: SQLConnection,
): Promise<void> => {};
