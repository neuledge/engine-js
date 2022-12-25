import { AbstractNode } from './abstract';
import { IdentifierNode } from './identifier';
import { LiteralNode } from './literal';

export interface ReferenceFieldNode extends AbstractNode<'ReferenceField'> {
  state: IdentifierNode;
  key: IdentifierNode;
  index: LiteralNode<number>;
}
