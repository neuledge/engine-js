import { createHash } from 'node:crypto';
import { MetadataEntityHash } from './entity.js';

const HASH_ALGORITHM = 'sha512';
const HASH_ENCODING = 'base64url';
const HASH_LENGTH = 12;

export const generateHash = (payload: unknown): MetadataEntityHash =>
  createHash(HASH_ALGORITHM)
    .update(JSON.stringify(payload))
    .digest(HASH_ENCODING)
    .slice(0, HASH_LENGTH);
