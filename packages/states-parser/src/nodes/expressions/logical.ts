import { AbstractNode } from '../abstract';
import { ExpressionNode } from './expression';

const LogicalExpressionNodeOperators = {
  '&&': 1,
  '||': 1,
  '??': 1,
} as const;

export const isLogicalExpressionNodeOperator = (
  operator: string,
): operator is keyof typeof LogicalExpressionNodeOperators =>
  operator in LogicalExpressionNodeOperators;

export interface LogicalExpressionNode
  extends AbstractNode<'LogicalExpression'> {
  operator: keyof typeof LogicalExpressionNodeOperators;
  left: ExpressionNode;
  right: ExpressionNode;
}
