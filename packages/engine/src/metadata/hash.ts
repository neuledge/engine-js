import { createHash } from 'node:crypto';
import { METADATA_HASH_BYTES } from './constants.js';

const HASH_ALGORITHM = 'sha512';

type HashPayload = string | number | boolean | HashPayload[];

export const generateHash = (payload: HashPayload): Buffer =>
  createHash(HASH_ALGORITHM)
    .update(JSON.stringify(payload))
    .digest()
    .slice(0, METADATA_HASH_BYTES);
