import { AbstractNode } from '../abstract.js';
import { ExpressionNode } from './expression.js';

export interface BinaryExpressionNode extends AbstractNode<'BinaryExpression'> {
  operator: '+' | '-' | '*' | '/' | '**';
  left: ExpressionNode;
  right: ExpressionNode;
}
