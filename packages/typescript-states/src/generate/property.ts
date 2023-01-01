import { Property, State } from '@neuledge/states';
import { generateExpression } from './expression';

export const generateStateFunctionBody = (
  state: State,
  properties: Property[],
  extendsThis: boolean,
  indent: string,
): string =>
  `{\n` +
  `${indent}  return {\n` +
  (extendsThis ? `${indent}    ...this,\n` : '') +
  `${indent}    $state: '${state.name}',\n` +
  properties
    .map(
      (property) =>
        `${indent}    ${generateProperty(property, `${indent}    `)},\n`,
    )
    .join('') +
  `${indent}  };\n` +
  `${indent}}`;

const generateProperty = (property: Property, indent: string): string => {
  const value = generateExpression(property.value, indent);

  if (value === property.name) {
    return property.name;
  }

  return `${property.name}: ${value}`;
};
