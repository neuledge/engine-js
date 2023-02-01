import { LogicalExpression } from '@neuledge/states';
import { generateExpression } from './index';

export const generateLogicalExpression = (
  expression: LogicalExpression,
  indent: string,
): string =>
  `(${generateExpression(expression.left, indent)} ${
    expression.operator
  } ${generateExpression(expression.right, indent)})`;
