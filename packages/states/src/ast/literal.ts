import { TokensParser } from '@/tokens/parser.js';
import { TokenType } from '@/tokens/type.js';

export interface LiteralNode {
  type: 'Literal';
  value: LiteralValue;
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
  value: parseLiteralValue(cursor),
});

const parseLiteralValue = (cursor: TokensParser): LiteralValue => {
  const token = cursor.current;

  switch (token?.type) {
    case TokenType.STRING:
    case TokenType.NUMBER: {
      cursor.position += 1;
      return token.value;
    }

    case TokenType.WORD: {
      const value = LiteralValues[token.name] as LiteralNode['value'];
      if (value === undefined) {
        throw cursor.createError(`literal value`);
      }

      cursor.position += 1;
      return value;
    }

    case TokenType.PUNCTUATION: {
      const { kind } = token;
      switch (kind) {
        case '-':
        case '+': {
          cursor.position += 1;

          const { position } = cursor;
          const value = parseLiteralValue(cursor);

          if (typeof value === 'number') {
            return kind === '-' ? -value : value;
          }

          // rollback position before throw
          cursor.position = position;
          throw cursor.createError(`literal number`);
        }

        case '[': {
          cursor.position += 1;

          const value: LiteralValue[] = [];
          if (cursor.maybeConsumePunctuation(']')) return value;

          do {
            value.push(parseLiteralValue(cursor));
          } while (cursor.maybeConsumePunctuation(','));

          cursor.consumePunctuation(']');
          return value;
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
