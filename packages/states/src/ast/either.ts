import { AbstractNode } from './abstract.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { TypeNode } from './type.js';

export interface EitherNode extends AbstractNode<'Either'> {
  identifier: IdentifierNode;
  description?: DescriptionNode;
  choices: TypeNode[];
}
