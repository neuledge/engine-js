import { TokensParser } from '@/tokens/parser.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { LiteralNode, parseLiteralNode } from './literal.js';

export interface ArgumentNode {
  type: 'Argument';
  key: IdentifierNode;
  value: LiteralNode;
}

export const parseMaybeArgumentNodes = (
  cursor: TokensParser,
): ArgumentNode[] => {
  if (
    !cursor.maybeConsumePunctuation('(') ||
    cursor.maybeConsumePunctuation(')')
  ) {
    return [];
  }

  const args: ArgumentNode[] = [];
  do {
    args.push(parseArgumentNode(cursor));
  } while (cursor.maybeConsumePunctuation(','));

  cursor.consumePunctuation(')');
  return args;
};

const parseArgumentNode = (cursor: TokensParser): ArgumentNode => {
  const key = parseIdentifierNode(cursor);
  cursor.consumePunctuation(':');
  const value = parseLiteralNode(cursor);

  return {
    type: 'Argument',
    key,
    value,
  };
};
