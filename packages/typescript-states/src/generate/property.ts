import { Parameter, Property, State } from '@neuledge/states';
import { generateExpression } from './expression';

export const generateStateFunctionBody = (
  state: State,
  parameters: Record<string, Parameter>,
  properties: Record<string, Property>,
  extendsThis: boolean,
  indent: string,
): string => {
  let res =
    `{\n` +
    `${indent}  return {\n` +
    (extendsThis ? `${indent}    ...this,\n` : '') +
    `${indent}    $state: '${state.name}',\n`;

  if (!extendsThis) {
    for (const key in state.fields) {
      if (properties[key] || parameters[key]) continue;

      res += `${indent}    ${key}: null,\n`;
    }
  }

  for (const key in parameters) {
    if (properties[key] || !state.fields[key]) continue;

    res += `${indent}    ${key},\n`;
  }

  for (const key in properties) {
    const property = properties[key];

    res += `${indent}    ${generateProperty(property, `${indent}    `)},\n`;
  }

  res += `${indent}  };\n${indent}}`;

  return res;
};

const generateProperty = (property: Property, indent: string): string => {
  const value = generateExpression(property.value, indent);

  if (value === property.name) {
    return property.name;
  }

  return `${property.name}: ${value}`;
};
