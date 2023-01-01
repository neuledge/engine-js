import { Parameter } from '@/parameter';
import { IdentifierNode, ParsingError } from '@neuledge/states-parser';

export interface IdentifierExpression {
  type: 'IdentifierExpression';
  node: IdentifierNode;
  reference: Parameter;
}

export const parseIdentifierExpression = (
  parameters: Record<string, Parameter>,
  node: IdentifierNode,
): IdentifierExpression => {
  const reference = parameters[node.name];

  if (!reference) {
    throw new ParsingError(node, `Unknown identifier '${node.name}'`);
  }

  return {
    type: 'IdentifierExpression',
    node,
    reference,
  };
};
