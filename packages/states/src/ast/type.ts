import { TokensParser } from '@/tokens/parser.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';

export type TypeNode = TypeGeneratorNode | TypeExpressionNode;

export interface TypeGeneratorNode {
  type: 'TypeGenerator';
  identifier: IdentifierNode;
  arguments: ArgumentNode[];
}

export interface TypeExpressionNode {
  type: 'TypeExpression';
  identifier: IdentifierNode;
  list: boolean;
}

export const parseTypeNode = (cursor: TokensParser): TypeNode => {
  const identifier = parseIdentifierNode(cursor);
  const args = parseMaybeArgumentNodes(cursor);

  if (args.length) {
    return {
      type: 'TypeGenerator',
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
    identifier,
    list,
  };
};
