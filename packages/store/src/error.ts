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
  public readonly originalError?: Error;

  constructor(
    public readonly code: StoreErrorCode,
    message: string,
    originalError?: Error | unknown,
  ) {
    super(message);
    this.name = 'StoreError';

    if (originalError) {
      this.originalError =
        originalError instanceof Error
          ? originalError
          : new Error(String(originalError));
    }
  }
}

export const throwStoreError = (error: unknown): never => {
  if (error instanceof StoreError) {
    throw error;
  }

  throw new StoreError(
    StoreError.Code.INTERNAL_ERROR,
    String((error as Error)?.message || error),
    error,
  );
};
