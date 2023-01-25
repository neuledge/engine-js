import { Arguments, parseArguments } from '@/arguments';
import { ParametersContext } from '@/parameter';
import { Callable, runtime } from '@neuledge/scalars';
import { CallExpressionNode, ExpressionNode } from '@neuledge/states-parser';
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
    throw new Error(`Unknown runtime function '${node.callee.name}'`);
  }

  return {
    type: 'CallExpression',
    node,
    callee,
    // FIXME `node.arguments` type is `ArgumentNode<ExpressionNode>[]`
    arguments: parseArguments(node.arguments as never, (node) =>
      parseExpression(params, node),
    ),
  };
};