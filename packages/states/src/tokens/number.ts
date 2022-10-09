import { AbstractToken } from './abstract.js';

export interface NumberToken extends AbstractToken<'Number'> {
  value: number;
}
