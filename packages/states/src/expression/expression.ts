import {
  Literal,
  NullLiteral,
  parseLiteral,
  parseNullLiteral,
} from '@/literal';
import { ParametersContext } from '@/parameter';
import { ExpressionNode } from '@neuledge/states-parser';
import { BinaryExpression, parseBinaryExpression } from './binary';
import { CallExpression, parseCallExpression } from './call';
import { IdentifierExpression, parseIdentifierExpression } from './identifier';
import { LogicalExpression, parseLogicalExpression } from './logical';
import { MemberExpression, parseMemberExpression } from './member';
import { parseThisExpression, ThisExpression } from './this';
import { parseUnaryExpression, UnaryExpression } from './unary';

export type Expression =
  | CallExpression
  | IdentifierExpression
  | ThisExpression
  | MemberExpression
  | UnaryExpression
  | BinaryExpression
  | LogicalExpression
  | NullLiteral
  | Literal;

export const parseExpression = (
  params: ParametersContext,
  node: ExpressionNode,
): Expression & { node: ExpressionNode } => {
  switch (node.type) {
    case 'CallExpression': {
      return parseCallExpression(params, node);
    }

    case 'Identifier': {
      return parseIdentifierExpression(params, node);
    }

    case 'ThisExpression': {
      return parseThisExpression(params, node);
    }

    case 'MemberExpression': {
      return parseMemberExpression(params, node);
    }

    case 'Literal': {
      return parseLiteral(node);
    }

    case 'UnaryExpression': {
      return parseUnaryExpression(params, node);
    }

    case 'BinaryExpression': {
      return parseBinaryExpression(params, node);
    }

    case 'LogicalExpression': {
      return parseLogicalExpression(params, node);
    }

    case 'NullLiteral': {
      return parseNullLiteral(node);
    }

    default: {
      // @ts-expect-error `node` type is never
      throw new TypeError(`Unexpected expression type: ${node.type}`);
    }
  }
};
