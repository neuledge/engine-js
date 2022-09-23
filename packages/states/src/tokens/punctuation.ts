import { AbstractToken } from './abstract.js';
import { TokenType } from './type.js';

export interface PunctuationToken extends AbstractToken<TokenType.PUNCTUATION> {
  kind: string;
}
