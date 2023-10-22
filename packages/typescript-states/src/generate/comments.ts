export const generateDescriptionComment = (
  {
    description,
    deprecated,
  }: {
    description?: string | null;
    deprecated?: string | boolean;
  },
  indent: string,
): string => {
  const deprecationReason = deprecated === true ? '' : deprecated || null;

  return description
    ? `/**\n${indent} * ${description.replaceAll('\n', `\n${indent} * `)}${
        deprecationReason
          ? `\n${indent} *\n${indent} * @deprecated ${deprecationReason.replaceAll(
              '\n',
              `\n${indent} * `,
            )}`
          : ''
      }\n${indent} */\n${indent}`
    : deprecationReason
    ? `/**\n${indent} * @deprecated ${deprecationReason.replaceAll(
        '\n',
        `\n${indent} * `,
      )}\n${indent} */\n${indent}`
    : '';
};
