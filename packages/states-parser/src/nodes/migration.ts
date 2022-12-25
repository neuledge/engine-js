import { AbstractNode } from './abstract';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode } from './identifier';
import { ReturnBodyNode } from './property';

export interface MigrationNode extends AbstractNode<'Migration'> {
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  origin: IdentifierNode;
  returns: IdentifierNode;
  body: ReturnBodyNode[];
}
