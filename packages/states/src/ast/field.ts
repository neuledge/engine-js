import { DecoratorNode } from './decorator.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { TypeNode } from './type.js';

export interface FieldNode {
  type: 'Field';
  identifier: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  fieldType: TypeNode;
  index: number;
  nullable: boolean;
}
