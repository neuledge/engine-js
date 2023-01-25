import { ScalarField, State } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import { generateEntityScalar, generateEntityType } from '../entity';
import { generateTypeScalar } from '../type';

export const generateStateScalars = (state: State, indent: string): string =>
  `() => ({${Object.values(state.fields)
    .filter((item): item is ScalarField => item.type === 'ScalarField')
    .map(
      (item) =>
        `\n${indent}  ${item.name}: { type: ${generateEntityScalar(
          item.entity,
        )}, index: ${item.index}${item.nullable ? ', nullable: true' : ''} },`,
    )
    .join('')}\n${indent}})`;

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

export const generateStateRelations = (
  state: State,
  indent: string,
): string => {
  const fields = Object.values(state.fields).filter(
    (item) => item.type === 'RelationField' || item.entity.type !== 'Scalar',
  );

  if (!fields.length) {
    return '{}';
  }

  return `() => ({${fields
    .map(
      (item) =>
        `\n${indent}  ${item.name}: ${
          item.type === 'ScalarField'
            ? generateEntityScalar(item.entity)
            : generateTypeScalar(item.as)
        } as const,`,
    )
    .join('')}\n${indent}})`;
};
