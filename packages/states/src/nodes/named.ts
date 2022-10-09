import { AbstractNode } from './abstract.js';
import { DecoratorNode } from './decorator.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';

export interface NamedNode<T extends string> extends AbstractNode<T> {
  id: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
}
