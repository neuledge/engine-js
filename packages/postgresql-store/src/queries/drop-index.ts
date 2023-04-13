import { SQLConnection } from '@neuledge/sql-store';

export const dropIndex = async (
  tableName: string,
  index: string,
  connection: SQLConnection,
): Promise<void> => {
  await connection.query(`DROP INDEX IF EXISTS ?`, [
    `${tableName}_${index}_idx`,
  ]);
};
