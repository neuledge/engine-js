import { BinaryExpression } from '@neuledge/states';
import { generateExpression } from './index';

export const generateBinaryExpression = (
  expression: BinaryExpression,
  indent: string,
): string =>
  `(${generateExpression(expression.left, indent)} ${
    expression.operator
  } ${generateExpression(expression.right, indent)})`;
