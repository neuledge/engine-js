import { AbstractToken } from './abstract.js';
import { TokenType } from './type.js';

export interface WordToken extends AbstractToken<TokenType.WORD> {
  name: string;
}
