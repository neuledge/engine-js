import { Tokenizer } from '@/tokenizer';
import { AbstractNode } from './abstract';

export interface LiteralNode<T extends LiteralValue = LiteralValue>
  extends AbstractNode<'Literal'> {
  value: T;
}

export type LiteralValue = string | number | boolean | null | LiteralValue[];

const LiteralValues: Partial<Record<string, LiteralNode['value']>> = {
  true: true,
  false: false,
  null: null,
  NaN: NaN,
  Infinity: Infinity,
};

export const parseLiteralNode = <Value extends LiteralValue>(
  cursor: Tokenizer,
  parseValue: (cursor: Tokenizer) => Value = parseLiteralValue as never,
): LiteralNode<Value> => ({
  type: 'Literal',
  path: cursor.path,
  start: cursor.start,
  value: parseValue(cursor),
  end: cursor.end,
});

export const parseUInt8LiteralNode = (
  cursor: Tokenizer,
): LiteralNode<number> => ({
  type: 'Literal',
  path: cursor.path,
  start: cursor.start,
  value: parseUInt8(cursor),
  end: cursor.end,
});

// value parsers

const parseUInt8 = (cursor: Tokenizer): number =>
  cursor.consume(
    'Number',
    ({ value }) => value > 0 && Number.isInteger(value) && value <= 255,
    `positive unsigned integer between 1 and 255`,
  ).value;

const parseLiteralValue = (cursor: Tokenizer): LiteralValue => {
  const token = cursor.current;

  switch (token?.type) {
    case 'String':
    case 'Number': {
      cursor.index += 1;
      return token.value;
    }

    case 'Word': {
      const value = LiteralValues[token.value] as LiteralNode['value'];
      if (value === undefined) {
        throw cursor.createError(`literal value`);
      }

      cursor.index += 1;
      return value;
    }

    case 'Punctuation': {
      const { value } = token;
      switch (value) {
        case '-':
        case '+': {
          cursor.index += 1;

          const { index: position } = cursor;
          const num = parseLiteralValue(cursor);

          if (typeof num === 'number') {
            return value === '-' ? -num : num;
          }

          // rollback position before throw
          cursor.index = position;
          throw cursor.createError(`literal number`);
        }

        case '[': {
          cursor.index += 1;
          return parseLiteralArrayValue(cursor);
        }

        default: {
          throw cursor.createError(`literal value`);
        }
      }
    }

    default: {
      throw cursor.createError(`literal value`);
    }
  }
};

const parseLiteralArrayValue = (cursor: Tokenizer): LiteralValue[] => {
  const value: LiteralValue[] = [];

  do {
    if (cursor.maybeConsumePunctuation(']')) {
      return value;
    }

    value.push(parseLiteralValue(cursor));
  } while (cursor.maybeConsumePunctuation(','));

  cursor.consumePunctuation(']');
  return value;
};
