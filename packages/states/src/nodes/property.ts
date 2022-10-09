import { AbstractNode } from './abstract.js';
import { ExpressionNode, MemberExpressionNode } from './expressions/index.js';
import { IdentifierNode } from './identifier.js';

export type ReturnBodyNode = PropertyNode | SpreadElementNode;

export interface PropertyNode extends AbstractNode<'Property'> {
  key: IdentifierNode;
  value: ExpressionNode;
}

export interface SpreadElementNode extends AbstractNode<'SpreadElement'> {
  argument: MemberExpressionNode['object'];
}
