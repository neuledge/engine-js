import { Either } from '@neuledge/states';
import { generateDescriptionComment } from './comments';

export const generateEither = (either: Either): string =>
  generateDescriptionComment(either, '') +
  `${generateEitherType(either)}\n` +
  `${generateEitherConst(either)}\n` +
  `export type $${either.name} = $.Entity<typeof ${either.name}[number]>;`;

const generateEitherType = (either: Either): string =>
  `export type ${either.name} = ${either.states
    .map((state) => state.name)
    .join(' | ')};`;

const generateEitherConst = (either: Either): string =>
  `export const ${either.name}: $.Either<'${either.name}', ${either.states
    .map((state) => `typeof ${state.name}`)
    .join(' | ')}> =\n  $.either('${either.name}', [${either.states
    .map((state) => state.name)
    .join(', ')}]);`;
