import { AbstractNode } from './abstract.js';
import { IdentifierNode } from './identifier.js';

export interface ExcludedFieldNode extends AbstractNode<'ExcludedField'> {
  key: IdentifierNode;
}
