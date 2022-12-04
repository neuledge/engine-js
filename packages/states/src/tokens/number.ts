import { AbstractToken } from './abstract';

export interface NumberToken extends AbstractToken<'Number'> {
  value: number;
}
