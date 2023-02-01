import { Literal, NullLiteral } from '@neuledge/states';

export const generateLiteral = (literal: Literal): string =>
  JSON.stringify(literal.value);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generateNullLiteral = (literal: NullLiteral): string => 'null';
