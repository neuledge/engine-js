import { AbstractNode } from '../abstract';
import { ExpressionNode } from './expression';

const BinaryExpressionNodeOperators = {
  '+': 1,
  '-': 1,
  '*': 1,
  '/': 1,
  '%': 1,
  '**': 1,
  '==': 1,
  '!=': 1,
  '===': 1,
  '!==': 1,
  '<': 1,
  '<=': 1,
  '>': 1,
  '>=': 1,
} as const;

export const isBinaryExpressionNodeOperator = (
  operator: string,
): operator is keyof typeof BinaryExpressionNodeOperators =>
  operator in BinaryExpressionNodeOperators;

export interface BinaryExpressionNode extends AbstractNode<'BinaryExpression'> {
  operator: keyof typeof BinaryExpressionNodeOperators;
  left: ExpressionNode;
  right: ExpressionNode;
}
