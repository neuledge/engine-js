import { Tokenizer } from '@/tokenizer';
import { LiteralNode, parseLiteralNode } from '../literal';
import { BinaryExpressionNode, isBinaryExpressionNodeOperator } from './binary';
import { CallExpressionNode, parseCallExpressionNode } from './call';
import {
  IdentifierExpressionNode,
  parseIdentifierExpressionNode,
} from './identifier';
import {
  isLogicalExpressionNodeOperator,
  LogicalExpressionNode,
} from './logical';
import { MemberExpressionNode, parseMemberExpressionNode } from './member';
import {
  isUnaryExpressionNodeOperator,
  parseUnaryExpressionNode,
  UnaryExpressionNode,
} from './unary';

export type ExpressionNode =
  | MemberExpressionNode
  | CallExpressionNode
  | BinaryExpressionNode
  | LogicalExpressionNode
  | UnaryExpressionNode
  | LiteralNode
  | IdentifierExpressionNode;

export const parseExpressionNode = (cursor: Tokenizer): ExpressionNode => {
  const start = cursor.start;
  const node = parseCoreExpressionNode(cursor);

  const current = cursor.current;
  if (current?.type !== 'Punctuation') {
    return node;
  }

  if (isLogicalExpressionNodeOperator(current.value)) {
    cursor.consume('Punctuation');
    const right = parseExpressionNode(cursor);

    return {
      type: 'LogicalExpression',
      path: cursor.path,
      start,
      end: cursor.end,
      operator: current.value,
      left: node,
      right,
    };
  }

  if (isBinaryExpressionNodeOperator(current.value)) {
    cursor.consume('Punctuation');
    const right = parseExpressionNode(cursor);

    return {
      type: 'BinaryExpression',
      path: cursor.path,
      start,
      end: cursor.end,
      operator: current.value,
      left: node,
      right,
    };
  }

  return node;
};

const parseCoreExpressionNode = (cursor: Tokenizer): ExpressionNode => {
  const { current, next } = cursor;

  if (current?.type === 'Punctuation') {
    if (current.value === '(') {
      cursor.consumePunctuation('(');

      const node = parseExpressionNode(cursor);
      cursor.consumePunctuation(')');

      return node;
    }

    if (isUnaryExpressionNodeOperator(current.value)) {
      return parseUnaryExpressionNode(cursor);
    }

    return parseLiteralNode(cursor);
  }

  if (current?.type !== 'Word') {
    return parseLiteralNode(cursor);
  }

  switch (next?.value) {
    case '(':
      return parseCallExpressionNode(cursor);

    case '.':
      return parseMemberExpressionNode(cursor);

    default:
      return parseIdentifierExpressionNode(cursor);
  }
};
