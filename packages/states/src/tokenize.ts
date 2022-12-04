import { PunctuationToken, StringToken, Token } from './tokens';

const TokenCharMap: Record<string, Token['type'] | 0 | -1> = {
  '"': 'String',
  "'": 'String',
  '': -1,
  ' ': -1,
  '\t': -1,
  '\r': -1,
  '\n': -1,
};
for (const char of '$_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  TokenCharMap[char] = 'Word';
}
for (const char of '0123456789') {
  TokenCharMap[char] = 'Number';
}

export const tokenize = (content: string, path?: string): Token[] => {
  const values = splitTokenValues(content);

  const tokens: Token[] = [];
  let position = 0;
  let line = 1;
  let column = 1;
  let isComment = false;
  let lastPunctuation: PunctuationToken | null = null;

  for (const value of values) {
    if (!isComment) {
      const token = parseToken(
        value,
        position,
        path && `${path}(${line},${column})`,
      );
      if (token) {
        if (lastPunctuation) {
          lastPunctuation.adjacent = true;
        }

        tokens.push(token);
        lastPunctuation = token.type === 'Punctuation' ? token : null;
      } else {
        lastPunctuation = null;
        if (value === '#') isComment = true;
      }
    }

    const lines = value.split(/\r*\n/g);
    if (lines.length > 1) {
      line += lines.length - 1;
      column = 1;
    }

    column += lines[lines.length - 1].length;
    position += value.length;

    if (isComment && value.includes('\n')) {
      isComment = false;
    }
  }

  return tokens;
};

const splitTokenValues = (content: string): string[] =>
  content.match(
    /([$_a-z]\w*|(?:\d*\.\d+|\d+)|\s+|"""(?:[^"]+|"[^"]|""[^"])*"""|"(?:[^\n"\\]+|\\.)*"|'(?:[^\n'\\]+|\\.)*'|[!%&*+.<=>@^|-]+|.)/gi,
  ) || [];

const parseToken = (
  value: string,
  position: number,
  path?: string,
): Token | null => {
  const kind = value[0];
  const type = TokenCharMap[kind] || 'Punctuation';
  const start = position;
  const end = position + value.length;

  switch (type) {
    case 'Number': {
      return { type, path, start, end, value: Number(value) };
    }

    case 'String': {
      return {
        type,
        start,
        end,
        ...parseStringToken(kind, value),
      };
    }

    case 'Punctuation': {
      if (value.length > 1 && /^[+-]?(?:\d*\.\d+|\d+)$/.test(value)) {
        return {
          type: 'Number',
          path,
          start,
          end,
          value: Number(value),
        };
      }

      if (value === '#') {
        return null;
      }

      return { type, path, start, end, value, adjacent: false };
    }

    case 'Word': {
      return { type, path, start, end, value };
    }

    case -1: {
      return null;
    }
  }
};

const parseStringToken = (
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
