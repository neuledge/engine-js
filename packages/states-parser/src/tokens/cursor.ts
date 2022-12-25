import { tokenize } from './tokenize';
import { ParsingError } from '@/error';
import { PunctuationToken, Token, WordToken } from './index';
import { AbstractToken } from './abstract';

export class TokenCursor {
  public readonly tokens: Token[];

  constructor(
    public readonly content: string,
    path?: string,
    public index = 0,
  ) {
    this.tokens = tokenize(content, path);
  }

  get current(): Token | undefined {
    return this.tokens[this.index];
  }

  get next(): Token | undefined {
    return this.tokens[this.index + 1];
  }

  get path(): string | undefined {
    return this.tokens[this.index]?.path;
  }

  get start(): number {
    return this.tokens[this.index]?.start ?? this.content.length;
  }

  get end(): number {
    return this.tokens[this.index - 1]?.end ?? 0;
  }

  static isMatch<T extends Token['type']>(
    token: Token | null | undefined,
    type: T,
    test?: ((token: Token & AbstractToken<T>) => boolean) | null,
  ): token is Token & AbstractToken<T> {
    if (token?.type !== type) {
      return false;
    }

    if (test == null) {
      return true;
    }

    try {
      return test(token as Token & AbstractToken<T>);
    } catch {
      return false;
    }
  }

  pickKeyword<V extends string>(
    ...values: V[]
  ): (WordToken & { value: V }) | null {
    return this.pick(
      'Word',
      values.length ? (token) => values.includes(token.value as V) : undefined,
    ) as (WordToken & { value: V }) | null;
  }

  consumeKeyword<V extends string>(...values: V[]): WordToken & { value: V } {
    return this.consume(
      'Word',
      (token) => values.includes(token.value as V),
      `'${values[0]}' keyword`,
    ) as WordToken & { value: V };
  }

  pickPunctuation<V extends string>(
    ...values: V[]
  ): PunctuationToken & { value: V } {
    return this.pick('Punctuation', (token) =>
      values.includes(token.value as V),
    ) as PunctuationToken & { value: V };
  }

  consumePunctuation<V extends string>(
    ...values: V[]
  ): PunctuationToken & { value: V } {
    return this.consume(
      'Punctuation',
      (token) => values.includes(token.value as V),
      `'${values[0]}' token`,
    ) as PunctuationToken & { value: V };
  }

  pick<T extends Token['type']>(
    type: T,
    test?: ((token: Token & AbstractToken<T>) => boolean) | null,
  ): (Token & AbstractToken<T>) | null {
    const token = this.current;

    if (!TokenCursor.isMatch<T>(token, type, test)) {
      return null;
    }

    return token as Token & AbstractToken<T>;
  }

  consume<T extends Token['type']>(
    type: T,
    test?: ((token: Token & AbstractToken<T>) => boolean) | null,
    expected?: string,
  ): Token & AbstractToken<T> {
    const token = this.pick<T>(type, test);

    if (!token) {
      throw this.createError(expected);
    }

    this.index += 1;
    return token;
  }

  createError(expected?: string): ParsingError {
    const token = this.current ?? null;

    return new ParsingError(
      token ?? { start: this.content.length - 1, end: this.content.length },
      expected
        ? `Expect ${expected}`
        : token
        ? `Unexpected token '${this.content.slice(token.start, token.end)}'`
        : `Unexpected EOF`,
    );
  }

  maybeConsumeKeyword<V extends string>(
    value: V,
  ): (WordToken & { value: V }) | undefined {
    const token = this.current;

    if (
      !token ||
      (token as WordToken).value !== value ||
      token.type !== 'Word'
    ) {
      return undefined;
    }

    this.index += 1;
    return token as WordToken & { value: V };
  }

  maybeConsumePunctuation<V extends string>(
    value: V,
  ): (PunctuationToken & { value: V }) | undefined {
    const token = this.current;

    if (
      !token ||
      (token as PunctuationToken).value !== value ||
      token.type !== 'Punctuation'
    ) {
      return undefined;
    }

    this.index += 1;
    return token as PunctuationToken & { value: V };
  }

  maybeConsume<T extends Token['type']>(
    type: T,
    test?: ((token: Token & AbstractToken<T>) => boolean) | null,
  ): (Token & AbstractToken<T>) | undefined {
    const token = this.current;

    if (!TokenCursor.isMatch<T>(token, type, test)) {
      return undefined;
    }

    this.index += 1;
    return token as Token & AbstractToken<T>;
  }

  transaction<T>(fn: () => T): T {
    const { index: position } = this;

    try {
      return fn();
    } catch (error) {
      this.index = position;
      throw error;
    }
  }
}
