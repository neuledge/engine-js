import { AbstractToken } from './abstract';

export interface PunctuationToken extends AbstractToken<'Punctuation'> {
  value: string;
  adjacent: boolean;
}
