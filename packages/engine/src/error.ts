export class NeuledgeError extends Error {
  constructor(public readonly code: NeuledgeErrorCode, message: string) {
    super(message);
    this.name = 'NeuledgeError';
  }
}

export enum NeuledgeErrorCode {
  // version checks
  VERSION_MISMATCH = 'VERSION_MISMATCH',

  // document checks
  DOCUMENT_NOT_FOUND = 'DOCUMENT_NOT_FOUND',

  // collection checks
  NO_COLLECTIONS = 'NO_COLLECTIONS',
  MULTIPLE_COLLECTIONS = 'MULTIPLE_COLLECTIONS',

  // state checks
  ENTITY_STATE_NOT_FOUND = 'ENTITY_STATE_NOT_FOUND',
  RESERVED_FIELD_NAME = 'RESERVED_FIELD_NAME',

  // sort checks
  UNKNOWN_SORT_DIRECTION = 'UNKNOWN_SORT_DIRECTION',
  UNKNOWN_SORT_INDEX = 'UNKNOWN_SORT_INDEX',

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

  // internal errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
}
