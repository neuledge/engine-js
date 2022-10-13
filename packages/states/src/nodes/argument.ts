import { Tokenizer } from '@/tokenizer.js';
import { AbstractNode } from './abstract.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';

export interface ArgumentNode<Value> extends AbstractNode<'Argument'> {
  key: IdentifierNode;
  value: Value;
}

export const parseMaybeArgumentNodes = <Value>(
  cursor: Tokenizer,
  parseValue: (cursor: Tokenizer) => Value,
): ArgumentNode<Value>[] => {
  const { index: position } = cursor;
  if (
    !cursor.maybeConsumePunctuation('(') ||
    cursor.maybeConsumePunctuation(')')
  ) {
    return [];
  }

  try {
    const args: ArgumentNode<Value>[] = [];
    do {
      if (cursor.maybeConsumePunctuation(')')) {
        return args;
      }

      args.push(parseArgumentNode(cursor, parseValue));
    } while (cursor.maybeConsumePunctuation(','));

    cursor.consumePunctuation(')');
    return args;
  } catch (error) {
    cursor.index = position;
    throw error;
  }
};

const parseArgumentNode = <Value>(
  cursor: Tokenizer,
  parseValue: (cursor: Tokenizer) => Value,
): ArgumentNode<Value> => {
  const start = cursor.start;
  const path = cursor.path;

  const key = parseIdentifierNode(cursor);
  cursor.consumePunctuation(':');
  const value = parseValue(cursor);

  return {
    type: 'Argument',
    path,
    start,
    end: cursor.end,
    key,
    value,
  };
};
