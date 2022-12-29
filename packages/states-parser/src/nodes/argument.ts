import { TokenCursor } from '@/tokens';
import { AbstractNode } from './abstract';
import { IdentifierNode, parseIdentifierNode } from './identifier';

export interface ArgumentNode<Value> extends AbstractNode<'Argument'> {
  key: IdentifierNode;
  value: Value;
}

export const parseMaybeArgumentNodes = <Value>(
  cursor: TokenCursor,
  parseValue: (cursor: TokenCursor) => Value,
  allowImplicit?: boolean,
): ArgumentNode<Value>[] => {
  if (!cursor.pickPunctuation('(')) {
    return [];
  }

  return parseArgumentNodes(cursor, parseValue, allowImplicit);
};

export const parseArgumentNodes = <Value>(
  cursor: TokenCursor,
  parseValue: (cursor: TokenCursor) => Value,
  allowImplicit?: boolean,
): ArgumentNode<Value>[] => {
  const { index: position } = cursor;

  cursor.consumePunctuation('(');

  try {
    const args: ArgumentNode<Value>[] = [];
    do {
      if (cursor.maybeConsumePunctuation(')')) {
        return args;
      }

      args.push(parseArgumentNode(cursor, parseValue, allowImplicit));
    } while (cursor.maybeConsumePunctuation(','));

    cursor.consumePunctuation(')');
    return args;
  } catch (error) {
    cursor.index = position;
    throw error;
  }
};

const parseArgumentNode = <Value>(
  cursor: TokenCursor,
  parseValue: (cursor: TokenCursor) => Value,
  allowImplicit?: boolean,
): ArgumentNode<Value> => {
  const start = cursor.start;
  const path = cursor.path;

  const key = parseIdentifierNode(cursor);

  const explicit = allowImplicit
    ? cursor.maybeConsumePunctuation(':')
    : cursor.consumePunctuation(':');

  const value = explicit ? parseValue(cursor) : (key as Value);

  return {
    type: 'Argument',
    path,
    start,
    end: cursor.end,
    key,
    value,
  };
};
