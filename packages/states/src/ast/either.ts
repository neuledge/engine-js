import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { TypeNode } from './type.js';

export interface EitherNode {
  type: 'Either';
  identifier: IdentifierNode;
  description?: DescriptionNode;
  choices: TypeNode[];
}
