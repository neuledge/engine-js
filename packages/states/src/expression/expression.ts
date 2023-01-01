import { Parameter } from '@/parameter';
import { ExpressionNode } from '@neuledge/states-parser';
import { CallExpression, parseCallExpression } from './call';
import { IdentifierExpression, parseIdentifierExpression } from './identifier';

export type Expression = CallExpression | IdentifierExpression;

export const parseExpression = (
  parameters: Record<string, Parameter>,
  node: ExpressionNode,
): Expression => {
  switch (node.type) {
    case 'CallExpression':
      return parseCallExpression(node);

    case 'Identifier':
      return parseIdentifierExpression(parameters, node);

    case 'Literal':
    case 'MemberExpression':
    case 'UnaryExpression':
    case 'BinaryExpression':
    case 'LogicalExpression':
    case 'ThisExpression':
    case 'NullLiteral':
      // FIXME implement other expression types
      throw new Error('Not implemented');

    default:
      // @ts-expect-error `node` type is never
      throw new TypeError(`Unexpected expression type: ${node.type}`);
  }
};
