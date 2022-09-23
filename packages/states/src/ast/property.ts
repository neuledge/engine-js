import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { TypeNode } from './type.js';

export interface PropertyNode {
  type: 'Property';
  identifier: IdentifierNode;
  description?: DescriptionNode;
  fieldType: TypeNode;
  nullable: boolean;
}
