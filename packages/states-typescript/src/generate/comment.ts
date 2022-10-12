import { DecoratorNode, DescriptionNode, ParsingError } from '@neuledge/states';

export const generateDescriptionComment = (
  {
    description,
    decorators,
  }: {
    description?: DescriptionNode | null;
    decorators: DecoratorNode[];
  },
  indent: string,
): string => {
  const deprecationReason = getDeprecationReason(decorators);

  return description
    ? `/**\n${indent} * ${description.value.replace(/\n/g, `\n${indent} * `)}${
        deprecationReason
          ? `\n${indent} *\n${indent} * @deprecated ${deprecationReason.replace(
              /\n/g,
              `\n${indent} * `,
            )}`
          : ''
      }\n${indent} */\n${indent}`
    : deprecationReason
    ? `/**\n${indent} * @deprecated ${deprecationReason.replace(
        /\n/g,
        `\n${indent} * `,
      )}\n${indent} */\n${indent}`
    : '';
};

const getDeprecationReason = (decorators: DecoratorNode[]): string | null => {
  const deprecated = decorators.find(
    (item) => item.callee.name === 'deprecated',
  );
  if (!deprecated) return null;

  const reason = deprecated.arguments.find(
    (item) => item.key.name === 'reason',
  );
  if (!reason) {
    throw new ParsingError(deprecated, `Missing 'reason' argument`);
  }
  if (typeof reason.value.value !== 'string') {
    throw new ParsingError(deprecated, `Expect 'reason' argument to be string`);
  }

  return reason.value.value;
};
