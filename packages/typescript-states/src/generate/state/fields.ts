import { FieldNode } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import { generateTypeofType } from '../type';

export const generateStateProjectionType = (
  fields: FieldNode[],
  indent: string,
): string =>
  `{${fields
    .map((item) => `\n${indent}  ${item.key.name}?: boolean;`)
    .join('')}\n${indent}}`;

export const generateStateFields = (
  fields: FieldNode[],
  indent: string,
): string =>
  `${fields
    .map(
      (item) =>
        `\n${indent}${generateDescriptionComment(item, indent)}${
          item.key.name
        }${
          item.nullable
            ? `?: ${generateTypeofType(item.valueType)} | null;`
            : `!: ${generateTypeofType(item.valueType)};`
        }`,
    )
    .join('')}`;
