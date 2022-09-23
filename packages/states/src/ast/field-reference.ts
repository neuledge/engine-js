import { IdentifierNode } from './identifier.js';

export interface FieldReferenceNode {
  type: 'FieldReference';
  state: IdentifierNode;
  identifier?: IdentifierNode;
  index?: number;
  substract?: boolean;
}
