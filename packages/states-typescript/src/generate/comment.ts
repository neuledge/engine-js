export const generateDescriptionComment = (
  {
    description,
    deprecationReason,
  }: {
    description?: string | null;
    deprecationReason?: string | null;
  },
  indent: string,
): string =>
  description
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
