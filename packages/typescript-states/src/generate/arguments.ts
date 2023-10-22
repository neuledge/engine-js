import { Arguments, Expression } from '@neuledge/states';
import { generateExpression } from './expression';

export const generateArguments = (
  args: Arguments<Expression>,
  indent: string,
): string => {
  const values = Object.values(args);

  if (!values.length) {
    return '{}';
  }

  return `{ ${values
    .map(
      (arg) =>
        `${generateArgumentName(arg.name)}: ${generateExpression(
          arg.value,
          indent,
        )}`,
    )
    .join(', ')} }`;
};

const generateArgumentName = (name: string): string =>
  /^\w+$/.test(name) ? name : `'${name.replaceAll(/(['\\])/g, '\\$1')}'`;
