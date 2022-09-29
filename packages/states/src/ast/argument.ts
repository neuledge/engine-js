import { TokensParser } from '@/tokens/parser.js';
import { AbstractNode } from './abstract.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { LiteralNode, parseLiteralNode } from './literal.js';

export interface ArgumentNode extends AbstractNode<'Argument'> {
  key: IdentifierNode;
  value: LiteralNode;
}

export const parseMaybeArgumentNodes = (
  cursor: TokensParser,
): ArgumentNode[] => {
  const { index: position } = cursor;
  if (
    !cursor.maybeConsumePunctuation('(') ||
    cursor.maybeConsumePunctuation(')')
  ) {
    return [];
  }

  try {
    const args: ArgumentNode[] = [];
    do {
      if (cursor.maybeConsumePunctuation(')')) {
        return args;
      }

      args.push(parseArgumentNode(cursor));
    } while (cursor.maybeConsumePunctuation(','));

    cursor.consumePunctuation(')');
    return args;
  } catch (error) {
    cursor.index = position;
    throw error;
  }
};

const parseArgumentNode = (cursor: TokensParser): ArgumentNode => {
  const start = cursor.start;

  const key = parseIdentifierNode(cursor);
  cursor.consumePunctuation(':');
  const value = parseLiteralNode(cursor);

  return {
    type: 'Argument',
    start,
    end: cursor.end,
    key,
    value,
  };
};
