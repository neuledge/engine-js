import { TokenCursor } from '@/tokens';
import { AbstractNode } from './abstract';

export interface LiteralNode<T extends LiteralValue = LiteralValue>
  extends AbstractNode<'Literal'> {
  value: T;
}

export type LiteralValue =
  | string
  | number
  | boolean
  | null
  | LiteralValue[]
  | { [K in string]?: LiteralValue };

const LiteralValues: Partial<Record<string, LiteralNode['value']>> = {
  true: true,
  false: false,
  null: null,
  NaN: NaN,
  Infinity: Infinity,
};

export const parseLiteralNode = <Value extends LiteralValue>(
  cursor: TokenCursor,
  parseValue: (cursor: TokenCursor) => Value = parseLiteralValue as never,
): LiteralNode<Value> => ({
  type: 'Literal',
  path: cursor.path,
  start: cursor.start,
  value: parseValue(cursor),
  end: cursor.end,
});

export const parseUInt8LiteralNode = (
  cursor: TokenCursor,
): LiteralNode<number> => ({
  type: 'Literal',
  path: cursor.path,
  start: cursor.start,
  value: parseUInt8(cursor),
  end: cursor.end,
});

// value parsers

const parseUInt8 = (cursor: TokenCursor): number =>
  cursor.consume(
    'Number',
    ({ value }) => value > 0 && Number.isInteger(value) && value <= 255,
    `positive unsigned integer between 1 and 255`,
  ).value;

const parseLiteralValue = (cursor: TokenCursor): LiteralValue => {
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
      return parseLiteralPunctuationValue(cursor, token.value);
    }

    default: {
      throw cursor.createError(`literal value`);
    }
  }
};

const parseLiteralPunctuationValue = (
  cursor: TokenCursor,
  value: string,
): LiteralValue => {
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
      const values = parseLiteralArrayValues(cursor);

      cursor.consumePunctuation(']');
      return values;
    }

    case '{': {
      cursor.index += 1;
      const entries = parseObjectEntries(cursor);

      cursor.consumePunctuation('}');
      return Object.fromEntries(entries);
    }

    default: {
      throw cursor.createError(`literal value`);
    }
  }
};

const parseLiteralArrayValues = (cursor: TokenCursor): LiteralValue[] => {
  const values: LiteralValue[] = [];

  while (!cursor.pickPunctuation(']')) {
    values.push(parseLiteralValue(cursor));

    if (!cursor.maybeConsumePunctuation(',')) {
      break;
    }
  }

  return values;
};

const parseObjectEntries = (cursor: TokenCursor): [string, LiteralValue][] => {
  const entries: [string, LiteralValue][] = [];

  while (!cursor.pickPunctuation('}')) {
    const key = (
      cursor.maybeConsume('String') ||
      cursor.consume('Word', undefined, `object key`)
    ).value;

    cursor.consumePunctuation(':');
    const value = parseLiteralValue(cursor);

    entries.push([key, value]);

    if (!cursor.maybeConsumePunctuation(',')) {
      break;
    }
  }

  return entries;
};
