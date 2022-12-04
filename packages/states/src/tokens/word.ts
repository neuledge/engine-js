import { AbstractToken } from './abstract';

export interface WordToken extends AbstractToken<'Word'> {
  value: string;
}
