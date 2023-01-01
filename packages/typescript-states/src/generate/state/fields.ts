import { ScalarField, State } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import { generateEntityScalar, generateEntityType } from '../entity';

export const generateStateScalars = (state: State, indent: string): string =>
  `{${Object.values(state.fields)
    .filter((item): item is ScalarField => item.type === 'ScalarField')
    .map(
      (item) =>
        `\n${indent}  ${item.name}: { type: ${generateEntityScalar(
          item.entity,
        )}, index: ${item.index}${item.nullable ? ', nullable: true' : ''} },`,
    )
    .join('')}\n${indent}}`;

export const generateStateFields = (state: State, indent: string): string =>
  `${Object.values(state.fields)
    .filter((item): item is ScalarField => item.type === 'ScalarField')
    .map(
      (item) =>
        `\n${indent}${generateDescriptionComment(item, indent)}${item.name}${
          item.nullable
            ? `?: ${generateEntityType(item.entity)} | null;`
            : `!: ${generateEntityType(item.entity)};`
        }`,
    )
    .join('')}`;
