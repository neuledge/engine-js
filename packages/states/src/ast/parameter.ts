import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { TypeNode } from './type.js';

export interface ParameterNode {
  type: 'Parameter';
  identifier: IdentifierNode;
  description?: DescriptionNode;
  fieldType: TypeNode;
  nullable: boolean;
}
