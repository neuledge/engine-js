import { AbstractNode } from './abstract';
import { ExpressionNode, MemberExpressionNode } from './expressions';
import { IdentifierNode } from './identifier';

export type ReturnBodyNode = PropertyNode | SpreadElementNode;

export interface PropertyNode extends AbstractNode<'Property'> {
  key: IdentifierNode;
  value: ExpressionNode;
}

export interface SpreadElementNode extends AbstractNode<'SpreadElement'> {
  argument: MemberExpressionNode['object'];
}
