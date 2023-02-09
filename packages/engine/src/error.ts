import { StoreError } from '@neuledge/store';

enum NeuledgeErrorCode {
  // version checks
  VERSION_MISMATCH = 'VERSION_MISMATCH',

  // argument errors
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',

  // document checks
  DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',

  // collection checks
  NO_COLLECTIONS = 'NO_COLLECTIONS',
  MULTIPLE_COLLECTIONS = 'MULTIPLE_COLLECTIONS',

  // state checks
  ENTITY_STATE_NOT_FOUND = 'ENTITY_STATE_NOT_FOUND',
  RESERVED_FIELD_NAME = 'RESERVED_FIELD_NAME',
  DUPLICATE_STATE_NAME = 'DUPLICATE_STATE_NAME',

  // sort checks
  UNKNOWN_SORT_DIRECTION = 'UNKNOWN_SORT_DIRECTION',
  UNKNOWN_SORT_INDEX = 'UNKNOWN_SORT_INDEX',
  UNKNOWN_SORT_FIELD = 'UNKNOWN_SORT_FIELD',

  // relation checks
  RELATION_FIELD_NOT_FOUND = 'RELATION_FIELD_NOT_FOUND',

  // query checks
  QUERY_PARSING_ERROR = 'QUERY_PARSING_ERROR',
  QUERY_EXECUTION_ERROR = 'QUERY_EXECUTION_ERROR',
  INVALID_MUTATION = 'INVALID_MUTATION',

  // metadata checks
  UNSUPPORTED_METADATA = 'UNSUPPORTED_METADATA',
  CORRUPTED_METADATA = 'CORRUPTED_METADATA',
  METADATA_SAVE_ERROR = 'METADATA_SAVE_ERROR',
  METADATA_LOAD_ERROR = 'METADATA_LOAD_ERROR',

  // internal errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NeuledgeError {
  export type Code = NeuledgeErrorCode;
}

export class NeuledgeError extends Error {
  static Code = NeuledgeErrorCode;

  static wrap =
    (code?: NeuledgeErrorCode, message?: string, hideOriginalError?: boolean) =>
    (originalError: Error): never => {
      throw NeuledgeError.fromError(
        originalError,
        code,
        message,
        hideOriginalError,
      );
    };

  static fromError(
    originalError: Error | unknown,
    code?: NeuledgeError.Code,
    message?: string,
    hideOriginalError?: boolean,
  ): NeuledgeError {
    if (originalError instanceof NeuledgeError) {
      return originalError;
    }

    const orgMsg = String((originalError as Error)?.message ?? originalError);

    const error = new NeuledgeError(
      originalError instanceof StoreError
        ? fromStoreErrorCode(originalError.code, code)
        : code ?? NeuledgeError.Code.INTERNAL_ERROR,
      hideOriginalError
        ? message ?? 'An unknown error occurred'
        : message != null
        ? `${message}: ${orgMsg}`
        : orgMsg,
    );

    error.stack = (originalError as Error)?.stack;
    error.originalError = originalError as Error;

    return error;
  }

  constructor(public readonly code: NeuledgeError.Code, message: string) {
    super(message);
    this.name = 'NeuledgeError';
  }

  public originalError?: Error;
}

const fromStoreErrorCode = (
  code: StoreError.Code,
  defaultCode?: NeuledgeError.Code,
): NeuledgeError.Code => {
  switch (code) {
    case StoreError.Code.INVALID_DATA:
      return NeuledgeError.Code.CORRUPTED_METADATA;

    case StoreError.Code.NOT_IMPLEMENTED:
      return NeuledgeError.Code.NOT_IMPLEMENTED;

    // case StoreError.Code.INVALID_INPUT:
    // case StoreError.Code.INTERNAL_ERROR:
    default:
      return defaultCode ?? NeuledgeError.Code.INTERNAL_ERROR;
  }
};
