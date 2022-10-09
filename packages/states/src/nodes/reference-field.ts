import { AbstractNode } from './abstract.js';
import { IdentifierNode } from './identifier.js';
import { LiteralNode } from './literal.js';

export interface ReferenceFieldNode extends AbstractNode<'ReferenceField'> {
  state: IdentifierNode;
  key: IdentifierNode;
  index: LiteralNode<number>;
}
