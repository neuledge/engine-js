import { AbstractToken } from './abstract.js';

export interface StringToken extends AbstractToken<'String'> {
  kind: '"' | "'" | '"""';
  value: string;
}
