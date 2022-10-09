import { AbstractNode } from './abstract.js';
import { DecoratorNode } from './decorator.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { TypeNode } from './type.js';

export interface ParameterNode extends AbstractNode<'Parameter'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorations: DecoratorNode[];
  valueType: TypeNode;
  nullable: boolean;
}
