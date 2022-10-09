import { AbstractNode } from '../abstract.js';
import { ExpressionNode } from './expression.js';

export interface UnaryExpressionNode extends AbstractNode<'UnaryExpression'> {
  operator: '!';
  argument: ExpressionNode;
}
