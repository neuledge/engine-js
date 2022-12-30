import { Parameter } from '@neuledge/states';
import { generateTypeofType } from './type';

export const generateParametersType = (
  parameters: Parameter[],
  indent: string,
): string => {
  if (!parameters.length) {
    return '{}';
  }

  return `{\n${parameters
    .map((parameter) => generateParameterType(parameter, indent))
    .join('')}${indent}}`;
};

const generateParameterType = (parameter: Parameter, indent: string): string =>
  `${indent}  ${parameter.name}${
    parameter.nullable ? '?' : ''
  }: ${generateTypeofType(parameter.as)}${
    parameter.nullable ? ' | null' : ''
  };\n`;

export const generateParametersArgument = (parameters: Parameter[]): string => {
  if (!parameters.length) {
    return '';
  }

  return `{ ${parameters.map((parameter) => parameter.name).join(', ')} }`;
};
