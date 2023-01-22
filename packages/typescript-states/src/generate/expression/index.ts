import { Expression } from '@neuledge/states';
import { generateLiteral } from '../literal';
import { generateCallExpression } from './call';
import { generateIdentifierExpression } from './identifier';
import { generateMemberExpression } from './member';
import { generateThisExpression } from './this';

export const generateExpression = (
  expression: Expression,
  indent: string,
): string => {
  switch (expression.type) {
    case 'IdentifierExpression':
      return generateIdentifierExpression(expression);

    case 'CallExpression':
      return generateCallExpression(expression, indent);

    case 'ThisExpression':
      return generateThisExpression(expression);

    case 'MemberExpression':
      return generateMemberExpression(expression, indent);

    case 'Literal':
      return generateLiteral(expression);

    default:
      // @ts-expect-error `expression` type is never
      throw new TypeError(`Unexpected expression: ${expression.type}`);
  }
};
