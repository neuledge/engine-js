import { AbstractNode } from '../abstract.js';
import { IdentifierNode } from '../identifier.js';

export interface MemberExpressionNode extends AbstractNode<'MemberExpression'> {
  object: IdentifierNode | MemberExpressionNode;
  property: IdentifierNode;
}
