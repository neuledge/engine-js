import { generateDescriptionComment } from './comment.js';

export const generateState = (state: StateDefinition): string =>
  generateDescriptionComment(state, '') +
  `export class ${getStateName(state)} {\n` +
  `  static $key = '${getStateKey(state)}' as const;\n` +
  `  static $projection: ${generateStateProjectionType(state, '  ')};\n` +
  `  static $query: ${generateStateQueryType(state, '  ')};\n` +
  `  static $uniqueQuery: ${generateStateUniqueQueryType(state, '  ')};\n` +
  `${generateStateFields(state, '  ')}\n` +
  `}`;

const getStateName = (state: StateDefinition): string =>
  `${state.name}_v${state.version}`;

const getStateKey = (state: StateDefinition): string =>
  `${state.name}-${state.version}`;

const generateStateProjectionType = (
  state: StateDefinition,
  indent: string,
): string =>
  `{${Object.values(state.fields)
    .map((item) => `\n${indent}  ${item.name}?: boolean;`)
    .join('')}\n${indent}}`;

const generateStateQueryType = (
  state: StateDefinition,
  indent: string,
): string =>
  `{${Object.values(state.fields)
    .filter((item) => item.primaryKey)
    .map(
      (item) =>
        `\n${indent}  ${item.name}?: ${generateStateFieldType(item.type)};`,
    )
    .join('')}\n${indent}}`;

const generateStateUniqueQueryType = (
  state: StateDefinition,
  indent: string,
): string =>
  `{${Object.values(state.fields)
    .filter((item) => item.primaryKey)
    .map(
      (item) =>
        `\n${indent}  ${item.name}: ${generateStateFieldType(item.type)};`,
    )
    .join('')}\n${indent}}`;

const generateStateFields = (state: StateDefinition, indent: string): string =>
  `${Object.values(state.fields)
    .map(
      (item) =>
        `\n${indent}${generateDescriptionComment(item, indent)}${item.name}${
          item.nullable
            ? `?: ${generateStateFieldType(item.type)} | null;`
            : `!: ${generateStateFieldType(item.type)};`
        }`,
    )
    .join('')}`;

const generateStateFieldType = (type: TypeDefinition): string => {
  switch (type.type) {
    case 'Scalar': {
      switch (type.scalar.name) {
        case 'String':
          return 'string';

        case 'Number':
          return 'number';

        case 'Boolean':
          return 'boolean';

        default:
          return type.scalar.name;
      }
    }

    case 'State':
      return getStateName(type.state);

    case 'Either':
      return type.either.name;
  }
};
