import { Arguments, Expression } from '@neuledge/states';
import { generateExpression } from './expression';

export const generateArguments = (
  args: Arguments<Expression>,
  indent: string,
): string =>
  `{ ${Object.values(args)
    .map(
      (arg) =>
        `${generateArgumentName(arg.name)}: ${generateExpression(
          arg.value,
          indent,
        )}`,
    )
    .join(', ')} }`;

const generateArgumentName = (name: string): string =>
  /^\w+$/.test(name) ? name : `'${name.replace(/(['\\])/g, '\\$1')}'`;
