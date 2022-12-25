import { AbstractNode } from './abstract';
import { IdentifierNode } from './identifier';

export interface ExcludedFieldNode extends AbstractNode<'ExcludedField'> {
  key: IdentifierNode;
}
