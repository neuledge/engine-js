import { Tokenizer } from '@/tokenizer.js';
import { AbstractNode } from './abstract.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { LiteralNode, parseLiteralNode } from './literal.js';

export type TypeNode = TypeGeneratorNode | TypeExpressionNode;

export interface TypeGeneratorNode extends AbstractNode<'TypeGenerator'> {
  identifier: IdentifierNode;
  arguments: ArgumentNode<LiteralNode>[];
}

export interface TypeExpressionNode extends AbstractNode<'TypeExpression'> {
  identifier: IdentifierNode;
  list: boolean;
}

export const parseTypeNode = (cursor: Tokenizer): TypeNode => {
  const start = cursor.start;
  const path = cursor.path;

  const identifier = parseIdentifierNode(cursor);
  const args = parseMaybeArgumentNodes(cursor, parseLiteralNode);

  if (args.length) {
    return {
      type: 'TypeGenerator',
      path,
      start,
      end: cursor.end,
      identifier,
      arguments: args,
    };
  }

  const list = !!cursor.maybeConsumePunctuation('[');
  if (list) {
    cursor.consumePunctuation(']');
  }

  return {
    type: 'TypeExpression',
    path,
    start,
    end: cursor.end,
    identifier,
    list,
  };
};
