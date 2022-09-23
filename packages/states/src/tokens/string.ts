import { AbstractToken } from './abstract.js';
import { TokenType } from './type.js';

export interface StringToken extends AbstractToken<TokenType.STRING> {
  kind: '"' | "'" | '"""';
  value: string;
}
