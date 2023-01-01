import { Callable, runtime } from '@neuledge/scalars';
import { CallExpressionNode } from '@neuledge/states-parser';

export interface CallExpression {
  type: 'CallExpression';
  node: CallExpressionNode;
  callee: Callable;
  // FIXME add arguments
}

export const parseCallExpression = (
  node: CallExpressionNode,
): CallExpression => {
  const callee = runtime[node.callee.name as keyof typeof runtime];
  if (!callee) {
    throw new Error(`Unknown runtime function '${node.callee.name}'`);
  }

  if (node.arguments.length) {
    throw new Error('Not implemented');
  }

  return {
    type: 'CallExpression',
    node,
    callee,
  };
};
