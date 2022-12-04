import { AbstractNode } from '../abstract';
import { IdentifierNode } from '../identifier';

export interface MemberExpressionNode extends AbstractNode<'MemberExpression'> {
  object: IdentifierNode | MemberExpressionNode;
  property: IdentifierNode;
}
