import { createHash } from 'node:crypto';
import { METADATA_HASH_BYTES } from './constants.js';
import { MetadataEntityHash } from './entity.js';

const HASH_ALGORITHM = 'sha512';

export const generateHash = (payload: unknown): MetadataEntityHash =>
  createHash(HASH_ALGORITHM)
    .update(JSON.stringify(payload))
    .digest()
    .slice(0, METADATA_HASH_BYTES);
