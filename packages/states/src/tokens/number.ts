import { AbstractToken } from './abstract.js';
import { TokenType } from './type.js';

export interface NumberToken extends AbstractToken<TokenType.NUMBER> {
  value: number;
}
