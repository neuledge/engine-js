import { ParametersContext } from '@/parameter';
import { State } from '@/state';
import { ParsingError, ThisExpressionNode } from '@neuledge/states-parser';

export interface ThisExpression {
  type: 'ThisExpression';
  node: ThisExpressionNode;
  reference: State;
}

export const parseThisExpression = (
  params: ParametersContext,
  node: ThisExpressionNode,
): ThisExpression => {
  if (params.this?.type !== 'State') {
    throw new ParsingError(node, 'ThisExpression is not allowed here');
  }

  return {
    type: 'ThisExpression',
    node,
    reference: params.this,
  };
};
