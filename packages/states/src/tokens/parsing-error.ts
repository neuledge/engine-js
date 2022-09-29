export class ParsingError extends SyntaxError {
  constructor(
    public readonly start: number,
    public readonly end: number,
    message: string,
  ) {
    super(message);

    // because we are extending a built-in class
    Object.setPrototypeOf(this, ParsingError.prototype);
  }
}
