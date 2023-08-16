import { StoreField, StoreScalarValue } from '@neuledge/store';
import {
  PostgreSQLConnection,
  encodeIdentifier,
  encodeLiteral,
} from './connection';

export const updateSet = async (
  connection: PostgreSQLConnection,
  name: string,
  setValues: [field: StoreField, value: StoreScalarValue][],
  where: string | null,
): Promise<number> => {
  const setClauses = setValues.map(
    ([field, value]) =>
      `${encodeIdentifier(field.name)} = ${encodeLiteral(value, field)}`,
  );

  const res = await connection.query(
    `UPDATE ${encodeIdentifier(name)} SET ${setClauses.join(', ')}${
      where ? ` WHERE ${where}` : ''
    }`,
  );

  return res.rowCount;
};
