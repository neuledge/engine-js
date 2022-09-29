import { TokenType } from './type.js';

export interface AbstractToken<T extends TokenType> {
  type: T;
  start: number;
  end: number;
}
