import { Expression } from '@neuledge/states';
import { generateCallExpression } from './call';
import { generateIdentifierExpression } from './identifier';

export const generateExpression = (
  expression: Expression,
  indent: string,
): string => {
  switch (expression.type) {
    case 'IdentifierExpression':
      return generateIdentifierExpression(expression);

    case 'CallExpression':
      return generateCallExpression(expression, indent);

    default:
      // @ts-expect-error `expression` type is never
      throw new TypeError(`Unexpected expression: ${expression.type}`);
  }
};
