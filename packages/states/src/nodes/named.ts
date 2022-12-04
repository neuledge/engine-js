import { AbstractNode } from './abstract';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode } from './identifier';

export interface NamedNode<T extends string> extends AbstractNode<T> {
  id: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
}
