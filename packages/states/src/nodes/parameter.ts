import { AbstractNode } from './abstract';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode } from './identifier';
import { TypeNode } from './type';

export interface ParameterNode extends AbstractNode<'Parameter'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorations: DecoratorNode[];
  valueType: TypeNode;
  nullable: boolean;
}
