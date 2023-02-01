import { ParametersContext } from '@/parameter';
import { BinaryExpressionNode } from '@neuledge/states-parser';
import { Expression, parseExpression } from './expression';

export interface BinaryExpression {
  type: 'BinaryExpression';
  node: BinaryExpressionNode;
  operator: BinaryExpressionOperator;
  left: Expression;
  right: Expression;
}

export type BinaryExpressionOperator = BinaryExpressionNode['operator'];

export const parseBinaryExpression = (
  params: ParametersContext,
  node: BinaryExpressionNode,
): BinaryExpression => ({
  type: 'BinaryExpression',
  node,
  operator: node.operator,
  left: parseExpression(params, node.left),
  right: parseExpression(params, node.right),
});
