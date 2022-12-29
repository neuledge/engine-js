import { AbstractNode } from './abstract';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode } from './identifier';
import { LiteralNode } from './literal';
import { TypeNode } from './type';

export interface FieldNode extends AbstractNode<'Field'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  as: TypeNode;
  index: LiteralNode<number>;
  nullable: boolean;
}
