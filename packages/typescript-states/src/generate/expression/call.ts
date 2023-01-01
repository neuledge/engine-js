import { CallExpression } from '@neuledge/states';

export const generateCallExpression = (
  expression: CallExpression,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  indent: string,
): string => `await $.runtime.${expression.callee.name}({})`;
