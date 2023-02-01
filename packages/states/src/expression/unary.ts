import { ParametersContext } from '@/parameter';
import { UnaryExpressionNode } from '@neuledge/states-parser';
import { Expression, parseExpression } from './expression';

export interface UnaryExpression {
  type: 'UnaryExpression';
  node: UnaryExpressionNode;
  operator: UnaryExpressionOperator;
  argument: Expression;
}

export type UnaryExpressionOperator = UnaryExpressionNode['operator'];

export const parseUnaryExpression = (
  params: ParametersContext,
  node: UnaryExpressionNode,
): UnaryExpression => ({
  type: 'UnaryExpression',
  node,
  operator: node.operator,
  argument: parseExpression(params, node.argument),
});
