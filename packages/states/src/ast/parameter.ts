import { AbstractNode } from './abstract.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { TypeNode } from './type.js';

export interface ParameterNode extends AbstractNode<'Parameter'> {
  type: 'Parameter';
  identifier: IdentifierNode;
  description?: DescriptionNode;
  fieldType: TypeNode;
  nullable: boolean;
}
