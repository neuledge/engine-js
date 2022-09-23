import { TokenType } from './type.js';

export interface AbstractToken<T extends TokenType> {
  type: T;
  raw: string;
  line: number;
  column: number;
}
