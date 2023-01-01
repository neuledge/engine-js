import { ParsingError, PropertyNode } from '@neuledge/states-parser';
import { StatesContext } from './context';
import {
  Expression,
  parseExpression,
  parseIdentifierExpression,
} from './expression';
import { Parameter } from './parameter';

export interface Property {
  type: 'Property';
  node?: PropertyNode;
  name: string;
  value: Expression;
}

export const parseProperties = (
  ctx: StatesContext,
  parameters: Record<string, Parameter>,
  nodes: PropertyNode[],
): Record<string, Property> => {
  const properties: Record<string, Property> = {};

  if (!nodes.length) {
    return Object.fromEntries(
      Object.entries(parameters).map(([key, param]) => [
        key,
        parseParameterProperty(parameters, param),
      ]),
    );
  }

  for (const node of nodes) {
    const property = parseProperty(parameters, node);

    if (properties[property.name]) {
      throw new ParsingError(node.key, `Duplicate property '${property.name}'`);
    }

    properties[property.name] = property;
  }

  return properties;
};

const parseProperty = (
  parameters: Record<string, Parameter>,
  node: PropertyNode,
): Property => ({
  type: 'Property',
  node,
  name: node.key.name,
  value: parseExpression(parameters, node.value),
});

const parseParameterProperty = (
  parameters: Record<string, Parameter>,
  parameter: Parameter,
): Property => ({
  type: 'Property',
  name: parameter.name,
  value: parseIdentifierExpression(parameters, parameter.node.key),
});
