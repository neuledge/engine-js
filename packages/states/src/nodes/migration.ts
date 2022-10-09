import { AbstractNode } from './abstract.js';
import { DecoratorNode } from './decorator.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { ReturnBodyNode } from './property.js';

export interface MigrationNode extends AbstractNode<'Migration'> {
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  origin: IdentifierNode;
  returns: IdentifierNode;
  body: ReturnBodyNode[];
}
