import { AbstractToken } from './abstract.js';

export interface WordToken extends AbstractToken<'Word'> {
  value: string;
}
