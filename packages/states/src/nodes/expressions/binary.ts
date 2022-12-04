import { AbstractNode } from '../abstract';
import { ExpressionNode } from './expression';

export interface BinaryExpressionNode extends AbstractNode<'BinaryExpression'> {
  operator: '+' | '-' | '*' | '/' | '**';
  left: ExpressionNode;
  right: ExpressionNode;
}
