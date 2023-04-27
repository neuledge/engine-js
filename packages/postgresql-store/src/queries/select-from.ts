import { StoreDocument } from '@neuledge/store';
import { PostgreSQLConnection } from './connection';

export const selectFrom = async (
  connection: PostgreSQLConnection,
  select: string,
  from: string,
  where: string | null,
  orderBy: string | null,
  limit: number,
  offset: number,
): Promise<StoreDocument[]> => {
  const { rows } = await connection.query(
    `SELECT ${select} FROM ${from}${where ? ` WHERE ${where}` : ''}${
      orderBy ? ` ORDER BY ${orderBy}` : ''
    } LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
  );

  return rows;
};
