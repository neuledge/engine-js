import { Expression } from '@neuledge/states';
import { generateLiteral, generateNullLiteral } from '../literal';
import { generateBinaryExpression } from './binary';
import { generateCallExpression } from './call';
import { generateIdentifierExpression } from './identifier';
import { generateLogicalExpression } from './logical';
import { generateMemberExpression } from './member';
import { generateThisExpression } from './this';
import { generateUnaryExpression } from './unary';

export const generateExpression = (
  expression: Expression,
  indent: string,
): string => {
  switch (expression.type) {
    case 'IdentifierExpression': {
      return generateIdentifierExpression(expression);
    }

    case 'CallExpression': {
      return generateCallExpression(expression, indent);
    }

    case 'ThisExpression': {
      return generateThisExpression(expression);
    }

    case 'MemberExpression': {
      return generateMemberExpression(expression, indent);
    }

    case 'Literal': {
      return generateLiteral(expression);
    }

    case 'UnaryExpression': {
      return generateUnaryExpression(expression, indent);
    }

    case 'BinaryExpression': {
      return generateBinaryExpression(expression, indent);
    }

    case 'LogicalExpression': {
      return generateLogicalExpression(expression, indent);
    }

    case 'NullLiteral': {
      return generateNullLiteral(expression);
    }

    default: {
      // @ts-expect-error `expression` type is never
      throw new TypeError(`Unexpected expression: ${expression.type}`);
    }
  }
};
