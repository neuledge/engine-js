import { ParametersContext } from '@/parameter';
import { IdentifierNode, MemberExpressionNode } from '@neuledge/states-parser';
import { IdentifierExpression, parseIdentifierExpression } from './identifier';
import { parseThisExpression, ThisExpression } from './this';

export interface MemberExpression {
  type: 'MemberExpression';
  node: MemberExpressionNode;
  object: IdentifierExpression | ThisExpression;
  properties: PropertyExpression[];
}

export interface PropertyExpression {
  type: 'PropertyExpression';
  node: IdentifierNode;
  name: string;
}

export const parseMemberExpression = (
  params: ParametersContext,
  node: MemberExpressionNode,
): MemberExpression => {
  const properties = [parsePropertyExpression(params, node.property)];

  while (node.object.type === 'MemberExpression') {
    properties.push(parsePropertyExpression(params, node.object.property));
    node = node.object;
  }

  const object =
    node.object.type === 'Identifier'
      ? parseIdentifierExpression(params, node.object)
      : parseThisExpression(params, node.object);

  return {
    type: 'MemberExpression',
    node,
    object,
    properties,
  };
};

const parsePropertyExpression = (
  params: ParametersContext,
  node: IdentifierNode,
): PropertyExpression => ({
  type: 'PropertyExpression',
  node,
  name: node.name,
});
