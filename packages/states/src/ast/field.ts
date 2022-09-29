import { AbstractNode } from './abstract.js';
import { DecoratorNode } from './decorator.js';
import { DescriptionNode } from './description.js';
import { IdentifierNode } from './identifier.js';
import { LiteralNode } from './literal.js';
import { TypeNode } from './type.js';

export interface FieldNode extends AbstractNode<'Field'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  fieldType: TypeNode;
  index: LiteralNode<number>;
  nullable: boolean;
}
