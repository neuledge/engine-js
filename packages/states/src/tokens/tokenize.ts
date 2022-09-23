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
  let line = 1;
  let column = 1;
  let isComment = false;

  for (const raw of raws) {
    if (!isComment) {
      const token = parseRawToken(raw, line, column);
      if (token) {
        tokens.push(token);
      } else if (raw === '#') {
        isComment = true;
      }
    }

    [line, column, isComment] = calcRawTokenPosition(
      raw,
      line,
      column,
      isComment,
    );
  }

  return tokens;
};

const getRawTokens = (content: string): string[] =>
  content
    .trim()
    .match(
      /([$_a-z]\w*|[+-]?(?:\d*\.\d+|\d+)|\s+|"""(?:[^"]+|"[^"]|""[^"])*"""|"(?:[^\n"\\]+|\\.)*"|'(?:[^\n'\\]+|\\.)*'|[!%&*+<=>@^|-]+|.)/gi,
    ) || [];

const parseRawToken = (
  raw: string,
  line: number,
  column: number,
): Token | null => {
  const kind = raw[0];
  const type = TokenCharMap[kind] || TokenType.PUNCTUATION;

  switch (type) {
    case TokenType.NUMBER: {
      return { type, value: Number(raw), raw, line, column };
    }

    case TokenType.STRING: {
      return {
        type,
        ...parseRawStringToken(kind, raw),
        raw,
        line,
        column,
      };
    }

    case TokenType.PUNCTUATION: {
      if (raw.length > 1 && /^[+-]?(?:\d*\.\d+|\d+)$/.test(raw)) {
        return {
          type: TokenType.NUMBER,
          value: Number(raw),
          raw,
          line,
          column,
        };
      }

      if (raw === '#') {
        return null;
      }

      return { type, kind: raw, raw, line, column };
    }

    case TokenType.WORD: {
      return { type, name: raw, raw, line, column };
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

const calcRawTokenPosition = (
  raw: string,
  line: number,
  column: number,
  isComment: boolean,
): [line: number, column: number, isComment: boolean] => {
  const lines = raw.split(/\n/g);
  if (lines.length === 1) {
    column += lines[0].length;
  } else {
    line += lines.length - 1;
    column = lines[lines.length - 1].length;
    isComment = false;
  }

  return [line, column, isComment];
};
