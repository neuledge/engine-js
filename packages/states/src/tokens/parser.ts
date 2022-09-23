import { tokenize } from './tokenize.js';
import { AbstractToken } from './abstract.js';
import { PunctuationToken } from './punctuation.js';
import { TokenSyntaxError } from './syntax-error.js';
import { Token } from './token.js';
import { TokenType } from './type.js';
import { WordToken } from './word.js';

export class TokensParser {
  public readonly tokens: Token[];

  constructor(
    public readonly sourceFile: string | null,
    content: string,
    public position = 0,
  ) {
    this.tokens = tokenize(content);
  }

  get current(): Token | undefined {
    return this.tokens[this.position];
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
      throw TokensParser.createSyntaxError(
        this.sourceFile,
        token || this.tokens[this.tokens.length - 1],
        expected,
      );
    }

    this.position += 1;
    return token as Token & AbstractToken<T>;
  }

  createError(expected?: string): TokenSyntaxError {
    return TokensParser.createSyntaxError(
      this.sourceFile,
      this.current,
      expected,
    );
  }

  static createSyntaxError(
    sourceFile: string | null,
    token: Token | null | undefined,
    expected?: string,
  ): TokenSyntaxError {
    return new TokenSyntaxError(
      sourceFile,
      token || { line: 0, column: 0 },
      expected
        ? `Expected ${expected}`
        : token
        ? `Unexpected token '${token.raw}'`
        : `Unexpected EOF`,
    );
  }

  maybeConsumePunctuation<K extends string>(
    kind: K,
  ): (PunctuationToken & { kind: K }) | undefined {
    return this.maybeConsume(
      TokenType.PUNCTUATION,
      (token) => token.kind === kind,
    ) as (PunctuationToken & { kind: K }) | undefined;
  }

  maybeConsume<T extends TokenType>(
    type: T,
    test?: ((token: Token & AbstractToken<T>) => boolean) | null,
  ): (Token & AbstractToken<T>) | undefined {
    const token = this.current;

    if (!TokensParser.isMatch<T>(token, type, test)) {
      return undefined;
    }

    this.position += 1;
    return token as Token & AbstractToken<T>;
  }

  transaction<T>(fn: () => T): T {
    const { position } = this;

    try {
      return fn();
    } catch (error) {
      this.position = position;
      throw error;
    }
  }
}
