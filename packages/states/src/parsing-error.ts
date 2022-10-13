export class ParsingError extends SyntaxError {
  public readonly name = 'ParsingError';

  public readonly start: number;
  public readonly end: number;
  public readonly path?: string;

  constructor(
    position: { start: number; end: number; path?: string },
    message: string,
  ) {
    super(message);

    // because we are extending a built-in class
    Object.setPrototypeOf(this, ParsingError.prototype);

    this.start = position.start;
    this.end = position.end;
    this.path = position.path;

    if (this.path) {
      this.stack = `${this.path}: ${this.message}`;
    }
  }
}
