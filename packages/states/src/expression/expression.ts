import { Literal, parseLiteral } from '@/literal';
import { ParametersContext } from '@/parameter';
import { ExpressionNode } from '@neuledge/states-parser';
import { CallExpression, parseCallExpression } from './call';
import { IdentifierExpression, parseIdentifierExpression } from './identifier';
import { MemberExpression, parseMemberExpression } from './member';
import { parseThisExpression, ThisExpression } from './this';

export type Expression =
  | CallExpression
  | IdentifierExpression
  | ThisExpression
  | MemberExpression
  | Literal;

export const parseExpression = (
  params: ParametersContext,
  node: ExpressionNode,
): Expression & { node: ExpressionNode } => {
  switch (node.type) {
    case 'CallExpression':
      return parseCallExpression(params, node);

    case 'Identifier':
      return parseIdentifierExpression(params, node);

    case 'ThisExpression':
      return parseThisExpression(params, node);

    case 'MemberExpression':
      return parseMemberExpression(params, node);

    case 'Literal':
      return parseLiteral(node);

    case 'UnaryExpression':
    case 'BinaryExpression':
    case 'LogicalExpression':
    case 'NullLiteral':
      // FIXME implement other expression types
      throw new Error(`Not implemented: '${node.type}' expression type`);

    default:
      // @ts-expect-error `node` type is never
      throw new TypeError(`Unexpected expression type: ${node.type}`);
  }
};
