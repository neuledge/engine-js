import { FieldNode, StateNode, TypeNode } from '@neuledge/states';
import { generateDescriptionComment } from './comments.js';

export const generateState = (state: StateNode, fields: FieldNode[]): string =>
  generateDescriptionComment(state, '') +
  `export class ${state.id.name} {\n` +
  `  static $key = '${state.id.name}' as const;\n` +
  `  static $projection: ${generateStateProjectionType(fields, '  ')};\n` +
  `  static $find: ${generateStateFindType(fields, '  ')};\n` +
  `  static $unique: ${generateStateUniqueType(fields, '  ')};\n` +
  `${generateStateFields(fields, '  ')}\n` +
  `}`;

const generateStateProjectionType = (
  fields: FieldNode[],
  indent: string,
): string =>
  `{${fields
    .map((item) => `\n${indent}  ${item.key.name}?: boolean;`)
    .join('')}\n${indent}}`;

const generateStateFindType = (fields: FieldNode[], indent: string): string =>
  `{${fields
    .filter((item) => item.decorators.some((item) => item.callee.name === 'id'))
    .map(
      (item) =>
        `\n${indent}  ${item.key.name}?: ${generateStateFieldType(
          item.valueType,
        )};`,
    )
    .join('')}\n${indent}}`;

const generateStateUniqueType = (fields: FieldNode[], indent: string): string =>
  `{${fields
    .filter((item) => item.decorators.some((item) => item.callee.name === 'id'))
    .map(
      (item) =>
        `\n${indent}  ${item.key.name}: ${generateStateFieldType(
          item.valueType,
        )};`,
    )
    .join('')}\n${indent}}`;

const generateStateFields = (fields: FieldNode[], indent: string): string =>
  `${fields
    .map(
      (item) =>
        `\n${indent}${generateDescriptionComment(item, indent)}${
          item.key.name
        }${
          item.nullable
            ? `?: ${generateStateFieldType(item.valueType)} | null;`
            : `!: ${generateStateFieldType(item.valueType)};`
        }`,
    )
    .join('')}`;

const generateStateFieldType = (type: TypeNode): string => {
  switch (type.identifier.name) {
    case 'String':
      return 'string';

    case 'Number':
      return 'number';

    case 'Boolean':
      return 'boolean';

    default:
      return type.identifier.name;
  }
};
