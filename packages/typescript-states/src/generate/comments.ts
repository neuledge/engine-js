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
    ? `/**\n${indent} * ${description.replace(/\n/g, `\n${indent} * `)}${
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
