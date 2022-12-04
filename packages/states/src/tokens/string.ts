import { AbstractToken } from './abstract';

export interface StringToken extends AbstractToken<'String'> {
  kind: '"' | "'" | '"""';
  value: string;
}
