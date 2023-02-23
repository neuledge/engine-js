import { ParsingError, PropertyNode } from '@neuledge/states-parser';
import { StatesContext } from './context';
import {
  Expression,
  parseExpression,
  parseIdentifierExpression,
} from './expression';
import { Parameter, ParametersContext } from './parameter';

export interface Property {
  type: 'Property';
  node?: PropertyNode;
  name: string;
  value: Expression;
}

export const parseProperties = (
  ctx: StatesContext,
  params: ParametersContext,
  nodes: PropertyNode[],
): Record<string, Property> => {
  const properties: Record<string, Property> = {};

  if (nodes.length) {
    for (const node of nodes) {
      const property = parseProperty(params, node);

      if (properties[property.name]) {
        throw new ParsingError(
          node.key,
          `Duplicate property '${property.name}'`,
        );
      }

      properties[property.name] = property;
    }
  } else {
    for (const parameter of Object.values(params.parameters)) {
      properties[parameter.name] = parseParameterProperty(params, parameter);
    }
  }

  return properties;
};

const parseProperty = (
  params: ParametersContext,
  node: PropertyNode,
): Property => ({
  type: 'Property',
  node,
  name: node.key.name,
  value: parseExpression(params, node.value),
});

const parseParameterProperty = (
  params: ParametersContext,
  parameter: Parameter,
): Property => ({
  type: 'Property',
  name: parameter.name,
  value: parseIdentifierExpression(params, parameter.node.key),
});
