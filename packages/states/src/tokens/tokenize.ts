import { PunctuationToken } from './punctuation.js';
import { StringToken } from './string.js';
import { Token } from './token.js';
import { TokenType } from './type.js';

const TokenCharMap: Record<string, Token['type'] | 0 | -1> = {
  '"': TokenType.STRING,
  "'": TokenType.STRING,
  '': -1,
  ' ': -1,
  '\t': -1,
  '\r': -1,
  '\n': -1,
};
for (const char of '$_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  TokenCharMap[char] = TokenType.WORD;
}
for (const char of '0123456789') {
  TokenCharMap[char] = TokenType.NUMBER;
}

export const tokenize = (content: string): Token[] => {
  const raws = getRawTokens(content);

  const tokens: Token[] = [];
  let position = 0;
  let isComment = false;
  let lastPunctuation: PunctuationToken | null = null;

  for (const raw of raws) {
    if (!isComment) {
      const token = parseRawToken(raw, position);
      if (token) {
        if (lastPunctuation) {
          lastPunctuation.adjacent = true;
        }

        tokens.push(token);
        lastPunctuation = token.type === TokenType.PUNCTUATION ? token : null;
      } else {
        lastPunctuation = null;
        if (raw === '#') isComment = true;
      }
    }

    position += raw.length;

    if (isComment && raw.includes('\n')) {
      isComment = false;
    }
  }

  return tokens;
};

const getRawTokens = (content: string): string[] =>
  content.match(
    /([$_a-z]\w*|(?:\d*\.\d+|\d+)|\s+|"""(?:[^"]+|"[^"]|""[^"])*"""|"(?:[^\n"\\]+|\\.)*"|'(?:[^\n'\\]+|\\.)*'|[!%&*+<=>@^|-]+|.)/gi,
  ) || [];

const parseRawToken = (raw: string, position: number): Token | null => {
  const kind = raw[0];
  const type = TokenCharMap[kind] || TokenType.PUNCTUATION;
  const start = position;
  const end = position + raw.length;

  switch (type) {
    case TokenType.NUMBER: {
      return { type, start, end, value: Number(raw) };
    }

    case TokenType.STRING: {
      return {
        type,
        start,
        end,
        ...parseRawStringToken(kind, raw),
      };
    }

    case TokenType.PUNCTUATION: {
      if (raw.length > 1 && /^[+-]?(?:\d*\.\d+|\d+)$/.test(raw)) {
        return {
          type: TokenType.NUMBER,
          start,
          end,
          value: Number(raw),
        };
      }

      if (raw === '#') {
        return null;
      }

      return { type, start, end, kind: raw, adjacent: false };
    }

    case TokenType.WORD: {
      return { type, start, end, name: raw };
    }

    case -1: {
      return null;
    }
  }
};

const parseRawStringToken = (
  kind: string,
  raw: string,
): Pick<StringToken, 'value' | 'kind'> => {
  if (kind === '"' && raw[1] === '"' && raw[2] === '"') {
    return {
      kind: '"""',
      value: raw
        .slice(3, -3)
        .trim()
        .replace(/[\t ]*\r?\n[\t ]*/g, '\n'),
    };
  }

  return {
    kind: kind as '"' | "'",
    value: raw.slice(1, -1).replace(/\\(.)/g, '$1'),
  };
};
