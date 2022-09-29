import { AbstractNode } from './abstract.js';
import { IdentifierNode } from './identifier.js';
import { LiteralNode } from './literal.js';

export type FieldReferenceNode = FieldReference &
  (
    | { index: LiteralNode<number>; substract?: false }
    | { index?: undefined; substract: true }
  );

interface FieldReference extends AbstractNode<'FieldReference'> {
  state: IdentifierNode;
  identifier: IdentifierNode;
  index?: LiteralNode<number>;
  substract?: boolean;
}
