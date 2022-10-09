import { AbstractToken } from './abstract.js';

export interface PunctuationToken extends AbstractToken<'Punctuation'> {
  value: string;
  adjacent: boolean;
}
