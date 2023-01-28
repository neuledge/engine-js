import { ScalarField, State } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import { generateTypeScalar, generateTypeType } from '../type';

export const generateStateScalars = (state: State, indent: string): string =>
  `() => ({${Object.values(state.fields)
    .filter((item): item is ScalarField => item.type === 'ScalarField')
    .map(
      (item) =>
        `\n${indent}  ${item.name}: { type: ${generateTypeScalar(
          item.as,
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
            ? `?: ${generateTypeType(item.as)} | null;`
            : `!: ${generateTypeType(item.as)};`
        }`,
    )
    .join('')}`;

export const generateStateOptionalRelations = (
  state: State,
  indent: string,
): string | null => {
  const fields = Object.values(state.fields).filter(
    (item) => item.type === 'RelationField' || item.as.entity.type !== 'Scalar',
  );

  if (!fields.length) {
    return null;
  }

  return `() => ({${fields
    .map(
      (item) =>
        `\n${indent}  ${item.name}: ${generateTypeScalar(item.as)} as const,`,
    )
    .join('')}\n${indent}})`;
};
