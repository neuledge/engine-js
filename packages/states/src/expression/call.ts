import { Arguments, parseArguments } from '@/arguments';
import { ParametersContext } from '@/parameter';
import { Callable, runtime } from '@neuledge/scalars';
import {
  CallExpressionNode,
  ExpressionNode,
  ParsingError,
} from '@neuledge/states-parser';
import { Expression, parseExpression } from './expression';

export interface CallExpression {
  type: 'CallExpression';
  node: CallExpressionNode;
  callee: Callable;
  arguments: Arguments<Expression & { node: ExpressionNode }>;
}

export const parseCallExpression = (
  params: ParametersContext,
  node: CallExpressionNode,
): CallExpression => {
  const callee = runtime[node.callee.name as keyof typeof runtime];
  if (!callee) {
    throw new ParsingError(
      node.callee,
      `Unknown runtime function '${node.callee.name}'`,
    );
  }

  return {
    type: 'CallExpression',
    node,
    callee,
    arguments: parseArguments(node.arguments, (node) =>
      parseExpression(params, node),
    ),
  };
};
