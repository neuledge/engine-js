enum StoreErrorCode {
  // abort errors
  ABORTED = 'ABORTED',

  // input errors
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_SUPPORTED = 'NOT_SUPPORTED',

  // collection errors
  COLLECTION_NOT_FOUND = 'COLLECTION_NOT_FOUND',

  // store errors
  INVALID_DATA = 'INVALID_DATA',

  // internal errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace StoreError {
  export type Code = StoreErrorCode;
}

export class StoreError extends Error {
  static Code = StoreErrorCode;

  constructor(
    public readonly code: StoreErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'StoreError';
  }
}
