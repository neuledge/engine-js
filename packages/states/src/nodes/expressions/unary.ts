import { AbstractNode } from '../abstract';
import { ExpressionNode } from './expression';

export interface UnaryExpressionNode extends AbstractNode<'UnaryExpression'> {
  operator: '!';
  argument: ExpressionNode;
}
