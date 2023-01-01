import { IdentifierExpression } from '@neuledge/states';

export const generateIdentifierExpression = (
  expression: IdentifierExpression,
): string => expression.reference.name;
