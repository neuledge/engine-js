import { Property, State } from '@neuledge/states';

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
  properties.map((property) => `${indent}    ${property.name},\n`).join('') +
  `${indent}  };\n` +
  `${indent}}`;
