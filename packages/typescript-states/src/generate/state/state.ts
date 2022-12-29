import { State } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import { generateStateFields, generateStateScalars } from './fields';
import { generateStateIdType, generateStateStaticIndexes } from './indexes';

export const generateState = (state: State): string =>
  generateDescriptionComment(state, '') +
  `@$.State<'${state.name}', ${state.name}>()\n` +
  `export class ${state.name} {\n` +
  `  static $name = '${state.name}' as const;\n` +
  `  static $id = ${generateStateIdType(state)} as const;\n` +
  `  static $scalars = ${generateStateScalars(state, '  ')};\n` +
  `  ${generateStateStaticIndexes(state, '  ')}\n` +
  `${generateStateFields(state, '  ')}\n` +
  `}\n` +
  `export type $${state.name} = $.Entity<typeof ${state.name}>;`;
