import { AbstractNode } from './abstract.js';
import { IdentifierNode } from './identifier.js';
import { LiteralNode } from './literal.js';
import { VersionateNode } from './versionate.js';

export type FieldReferenceNode = FieldReference &
  (
    | { index: LiteralNode<number>; substract?: false }
    | { index?: undefined; substract: true }
  );

interface FieldReference extends AbstractNode<'FieldReference'> {
  state: VersionateNode;
  key: IdentifierNode;
  index?: LiteralNode<number>;
  substract?: boolean;
}
