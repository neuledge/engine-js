export class ParsingError extends SyntaxError {
  public readonly start: number;
  public readonly end: number;

  constructor(position: { start: number; end: number }, message: string) {
    super(message);

    this.start = position.start;
    this.end = position.end;

    // because we are extending a built-in class
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}
