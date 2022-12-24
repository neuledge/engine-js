import { Tokenizer } from '@/tokenizer';
import { AbstractNode } from './abstract';
import {
  ExpressionNode,
  MemberExpressionNode,
  parseExpressionNode,
} from './expressions';
import { IdentifierNode, parseIdentifierNode } from './identifier';

export type ReturnBodyNode = PropertyNode | SpreadElementNode;

export interface PropertyNode extends AbstractNode<'Property'> {
  key: IdentifierNode;
  value: ExpressionNode;
}

export interface SpreadElementNode extends AbstractNode<'SpreadElement'> {
  argument: MemberExpressionNode['object'];
}

export const parseReturnBodyNodes = (cursor: Tokenizer): ReturnBodyNode[] => {
  const body: ReturnBodyNode[] = [];

  cursor.consumePunctuation('{');

  do {
    if (cursor.maybeConsumePunctuation('}')) {
      return body;
    }

    body.push(parseReturnBodyNode(cursor));
  } while (cursor.maybeConsumePunctuation(','));

  cursor.consumePunctuation('}');
  return body;
};

const parseReturnBodyNode = (cursor: Tokenizer): ReturnBodyNode => {
  const start = cursor.start;

  const key = parseIdentifierNode(cursor);

  const explicit = cursor.maybeConsumePunctuation(':');
  const value = explicit ? parseExpressionNode(cursor) : key;

  return {
    type: 'Property',
    path: cursor.path,
    start,
    end: cursor.end,
    key,
    value,
  };
};
