import { TokensParser } from '@/tokens/parser.js';
import { AbstractNode } from './abstract.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';

export type TypeNode = TypeGeneratorNode | TypeExpressionNode;

export interface TypeGeneratorNode extends AbstractNode<'TypeGenerator'> {
  identifier: IdentifierNode;
  arguments: ArgumentNode[];
}

export interface TypeExpressionNode extends AbstractNode<'TypeExpression'> {
  identifier: IdentifierNode;
  list: boolean;
}

export const parseTypeNode = (cursor: TokensParser): TypeNode => {
  const start = cursor.start;

  const identifier = parseIdentifierNode(cursor);
  const args = parseMaybeArgumentNodes(cursor);

  if (args.length) {
    return {
      type: 'TypeGenerator',
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
    start,
    end: cursor.end,
    identifier,
    list,
  };
};
