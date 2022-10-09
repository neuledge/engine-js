import { AbstractNode } from '../abstract.js';
import { ExpressionNode } from './expression.js';

export interface LogicalExpressionNode
  extends AbstractNode<'LogicalExpression'> {
  operator: '&&' | '||' | '??';
  left: ExpressionNode;
  right: ExpressionNode;
}
