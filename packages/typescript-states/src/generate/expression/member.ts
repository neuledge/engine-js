import { MemberExpression, PropertyExpression } from '@neuledge/states';
import { generateExpression } from './index';

export const generateMemberExpression = (
  expression: MemberExpression,
  indent: string,
): string => {
  const object = generateExpression(expression.object, indent);

  return `${object}${expression.properties
    .map((p) => generatePropertyExpression(p))
    .join('')}`;
};

const generatePropertyExpression = (expression: PropertyExpression): string =>
  /^\w+$/.test(expression.name)
    ? `.${expression.name}`
    : `['${expression.name.replaceAll(/(['\\])/g, '\\$1')}']`;
