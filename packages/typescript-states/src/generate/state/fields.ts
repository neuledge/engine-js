import { State } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import { generateScalarType, generateTypeofType, isScalarType } from '../type';

export const generateStateScalars = (state: State, indent: string): string =>
  `{${Object.values(state.fields)
    .filter((item) => isScalarType(item.as))
    .map(
      (item) =>
        `\n${indent}  ${item.name}: { type: ${generateScalarType(
          item.as,
        )}, index: ${item.index}${item.nullable ? ', nullable: true' : ''} },`,
    )
    .join('')}\n${indent}}`;

export const generateStateFields = (state: State, indent: string): string =>
  `${Object.values(state.fields)
    .filter((item) => isScalarType(item.as))
    .map(
      (item) =>
        `\n${indent}${generateDescriptionComment(item, indent)}${item.name}${
          item.nullable
            ? `?: ${generateTypeofType(item.as)} | null;`
            : `!: ${generateTypeofType(item.as)};`
        }`,
    )
    .join('')}`;
