import { FieldNode, StateNode } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import { generateStateFields, generateStateProjectionType } from './fields';
import { generateStateStaticIndexes } from './indexes';

export const generateState = (state: StateNode, fields: FieldNode[]): string =>
  generateDescriptionComment(state, '') +
  `@$.State<'${state.id.name}', ${state.id.name}>()\n` +
  `export class ${state.id.name} {\n` +
  `  static $name = '${state.id.name}' as const;\n` +
  `  static $projection: ${generateStateProjectionType(fields, '  ')};\n` +
  `  ${generateStateStaticIndexes(state, fields, '  ')}\n` +
  `${generateStateFields(fields, '  ')}\n` +
  `}`;
