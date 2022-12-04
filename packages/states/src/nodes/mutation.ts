import { AbstractNode } from './abstract';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode } from './identifier';
import { ParameterNode } from './parameter';
import { ReturnBodyNode } from './property';

export interface MutationNode extends AbstractNode<'Mutation'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  state?: IdentifierNode;
  parameters: ParameterNode[];
  returns: IdentifierNode;
  body: ReturnBodyNode[];
}
