import { UnaryExpression } from '@neuledge/states';
import { generateExpression } from './index';

export const generateUnaryExpression = (
  expression: UnaryExpression,
  indent: string,
): string =>
  `${expression.operator}${generateExpression(expression.argument, indent)}`;
