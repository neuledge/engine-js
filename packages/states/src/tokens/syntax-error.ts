import { Token } from './token.js';

export class TokenSyntaxError extends SyntaxError {
  constructor(
    sourceFile: string | null,
    token: Pick<Token, 'line' | 'column'>,
    message: string,
  ) {
    super(
      sourceFile
        ? `${sourceFile}(${token.line},${token.column}): ${message}`
        : `${message} (line: ${token.line}, column: ${token.column})`,
    );

    // because we are extending a built-in class
    Object.setPrototypeOf(this, TokenSyntaxError.prototype);
  }
}
