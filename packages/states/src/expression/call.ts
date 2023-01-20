import { Arguments, parseArguments } from '@/arguments';
import { Parameter } from '@/parameter';
import { Callable, runtime } from '@neuledge/scalars';
import { CallExpressionNode } from '@neuledge/states-parser';
import { Expression, parseExpression } from './expression';

export interface CallExpression {
  type: 'CallExpression';
  node: CallExpressionNode;
  callee: Callable;
  arguments: Arguments<Expression>;
}

export const parseCallExpression = (
  parameters: Record<string, Parameter>,
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
      parseExpression(parameters, node),
    ),
  };
};
