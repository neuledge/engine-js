import { State } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import {
  generateStateFields,
  generateStateOptionalRelations,
  generateStateScalars,
} from './fields';
import {
  generateStateIdType,
  generateStateOptionalIndexes,
  generateStateQueryIndexes,
} from './indexes';
import {
  generateStateMutations,
  generateStateOptionalTransforms,
} from './mutations';

export const generateState = (state: State): string => {
  const relations = generateStateOptionalRelations(state, '  ');
  const transforms = generateStateOptionalTransforms(state, '  ');
  const indexes = generateStateOptionalIndexes(state, '  ');

  return (
    generateDescriptionComment(state, '') +
    `@$.State<'${state.name}', ${state.name}>()\n` +
    `export class ${state.name} {\n` +
    `  static $name = '${state.name}' as const;\n` +
    `  static $id = ${generateStateIdType(state)} as const;\n` +
    `  static $scalars = ${generateStateScalars(state, '  ')};\n` +
    `  ${generateStateQueryIndexes(state, '  ')}\n` +
    (relations ? `  static $relations = ${relations};\n` : '') +
    (indexes ? `  static $indexes = ${indexes};\n` : '') +
    (transforms ? `  static $transforms = ${transforms};\n` : '') +
    `${generateStateFields(state, '  ')}\n` +
    generateStateMutations(state, '  ') +
    `}\n` +
    `export type $${state.name} = $.Entity<typeof ${state.name}>;`
  );
};
