import { AbstractNode } from './abstract.js';
import { DecoratorNode } from './decorator.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { ParameterNode } from './parameter.js';
import { ReturnBodyNode } from './property.js';

export interface MutationNode extends AbstractNode<'Mutation'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  state?: IdentifierNode;
  parameters: ParameterNode[];
  returns: IdentifierNode;
  body: ReturnBodyNode[];
}
