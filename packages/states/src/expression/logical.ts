import { ParametersContext } from '@/parameter';
import { LogicalExpressionNode } from '@neuledge/states-parser';
import { Expression, parseExpression } from './expression';

export interface LogicalExpression {
  type: 'LogicalExpression';
  node: LogicalExpressionNode;
  operator: LogicalExpressionOperator;
  left: Expression;
  right: Expression;
}

export type LogicalExpressionOperator = LogicalExpressionNode['operator'];

export const parseLogicalExpression = (
  params: ParametersContext,
  node: LogicalExpressionNode,
): LogicalExpression => ({
  type: 'LogicalExpression',
  node,
  operator: node.operator,
  left: parseExpression(params, node.left),
  right: parseExpression(params, node.right),
});
