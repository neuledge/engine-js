import { TokensParser } from '@/tokens/parser.js';
import { TokenType } from '@/tokens/type.js';
import { AbstractNode } from './abstract.js';

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

export const parseLiteralNode = (cursor: TokensParser): LiteralNode => ({
  type: 'Literal',
  start: cursor.start,
  value: parseLiteralValue(cursor),
  end: cursor.end,
});

const parseLiteralValue = (cursor: TokensParser): LiteralValue => {
  const token = cursor.current;

  switch (token?.type) {
    case TokenType.STRING:
    case TokenType.NUMBER: {
      cursor.index += 1;
      return token.value;
    }

    case TokenType.WORD: {
      const value = LiteralValues[token.name] as LiteralNode['value'];
      if (value === undefined) {
        throw cursor.createError(`literal value`);
      }

      cursor.index += 1;
      return value;
    }

    case TokenType.PUNCTUATION: {
      const { kind } = token;
      switch (kind) {
        case '-':
        case '+': {
          cursor.index += 1;

          const { index: position } = cursor;
          const value = parseLiteralValue(cursor);

          if (typeof value === 'number') {
            return kind === '-' ? -value : value;
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

const parseLiteralArrayValue = (cursor: TokensParser): LiteralValue[] => {
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
