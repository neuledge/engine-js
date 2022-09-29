import { tokenize } from './tokenize.js';
import { AbstractToken } from './abstract.js';
import { PunctuationToken } from './punctuation.js';
import { ParsingError } from './parsing-error.js';
import { Token } from './token.js';
import { TokenType } from './type.js';
import { WordToken } from './word.js';

export class TokensParser {
  public readonly tokens: Token[];

  constructor(public readonly content: string, public index = 0) {
    this.tokens = tokenize(content);
  }

  get current(): Token | undefined {
    return this.tokens[this.index];
  }

  get start(): number {
    return this.tokens[this.index]?.start ?? this.content.length;
  }

  get end(): number {
    return this.tokens[this.index - 1]?.end ?? 0;
  }

  //   match<T extends TokenType>(
  //     type: T,
  //     test?: (token: Token & AbstractToken<T>) => boolean,
  //   ): boolean {
  //     return TokensCursor.isMatch<T>(this.current, type, test);
  //   }

  static isMatch<T extends TokenType>(
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

  consumeKeyword<N extends string>(name: N): WordToken & { name: N } {
    return this.consume(
      TokenType.WORD,
      (token) => token.name === name,
      `'${name}' keyword`,
    ) as WordToken & { name: N };
  }

  consumePunctuation<K extends string>(
    kind: K,
  ): PunctuationToken & { kind: K } {
    return this.consume(
      TokenType.PUNCTUATION,
      (token) => token.kind === kind,
      `'${kind}' token`,
    ) as PunctuationToken & { kind: K };
  }

  consume<T extends TokenType>(
    type: T,
    test?: ((token: Token & AbstractToken<T>) => boolean) | null,
    expected?: string,
  ): Token & AbstractToken<T> {
    const token = this.current;

    if (!TokensParser.isMatch<T>(token, type, test)) {
      throw this.createError(expected);
    }

    this.index += 1;
    return token as Token & AbstractToken<T>;
  }

  createError(expected?: string): ParsingError {
    const token = this.current ?? null;

    return new ParsingError(
      token?.start ?? this.content.length - 1,
      token?.end ?? this.content.length,
      expected
        ? `Expect ${expected}`
        : token
        ? `Unexpected token '${this.content.slice(token.start, token.end)}'`
        : `Unexpected EOF`,
    );
  }

  maybeConsumeKeyword<N extends string>(
    name: N,
  ): (WordToken & { name: N }) | undefined {
    const token = this.current;

    if (
      !token ||
      (token as WordToken & { name: N }).name !== name ||
      token.type !== TokenType.WORD
    ) {
      return undefined;
    }

    this.index += 1;
    return token as WordToken & { name: N };
  }

  maybeConsumePunctuation<K extends string>(
    kind: K,
  ): (PunctuationToken & { kind: K }) | undefined {
    const token = this.current;

    if (
      !token ||
      (token as PunctuationToken & { kind: K }).kind !== kind ||
      token.type !== TokenType.PUNCTUATION
    ) {
      return undefined;
    }

    this.index += 1;
    return token as PunctuationToken & { kind: K };
  }

  maybeConsume<T extends TokenType>(
    type: T,
    test?: ((token: Token & AbstractToken<T>) => boolean) | null,
  ): (Token & AbstractToken<T>) | undefined {
    const token = this.current;

    if (!TokensParser.isMatch<T>(token, type, test)) {
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
