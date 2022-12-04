import { AbstractNode } from '../abstract';
import { ExpressionNode } from './expression';

export interface LogicalExpressionNode
  extends AbstractNode<'LogicalExpression'> {
  operator: '&&' | '||' | '??';
  left: ExpressionNode;
  right: ExpressionNode;
}
