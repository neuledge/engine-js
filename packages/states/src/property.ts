import { ParsingError, PropertyNode } from '@neuledge/states-parser';
import { StatesContext } from './context';
import { Parameter } from './parameter';

export interface Property {
  type: 'Property';
  node?: PropertyNode;
  name: string;
  // FIXME add value
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
        parseParameterProperty(param),
      ]),
    );
  }

  for (const node of nodes) {
    const property = parseProperty(node);

    if (properties[property.name]) {
      throw new ParsingError(node.key, `Duplicate property '${property.name}'`);
    }

    properties[property.name] = property;
  }

  return properties;
};

const parseProperty = (node: PropertyNode): Property => ({
  type: 'Property',
  node,
  name: node.key.name,
});

const parseParameterProperty = (parameter: Parameter): Property => ({
  type: 'Property',
  name: parameter.name,
});
