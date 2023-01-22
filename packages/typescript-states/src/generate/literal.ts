import { Literal } from '@neuledge/states';

export const generateLiteral = (literal: Literal): string =>
  JSON.stringify(literal.value);
