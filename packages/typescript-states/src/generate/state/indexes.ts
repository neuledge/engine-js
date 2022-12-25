import { FieldNode, StateNode } from '@neuledge/states';
import { generateTypeofType } from '../type';

export interface StateIndex {
  fields: { field: FieldNode; direction: 1 | -1 }[];
  unique?: boolean;
  primary?: boolean;
}

// export const parseStateIndexes = (
//   state: StateNode,
//   fields: FieldNode[],
// ): StateIndex[] => {
//   const primary: StateIndex = {
//     fields: fields
//       .filter((item) =>
//         item.decorators.some((item) => item.callee.name === 'id'),
//       )
//       .map((field) => ({ field, direction: 1 })),
//     primary: true,
//   };
//
//   const indexes = state.decorators
//     .filter((item) => item.callee.name === 'index')
//     .map((item): StateIndex => {
//       const fieldsArg = item.arguments.find((arg) => arg.key.name === 'fields');
//
//       if (!fieldsArg) {
//         throw new ParsingError(item, "Missing 'fields' argument");
//       }
//
//       const keys = fieldsArg.value.value;
//       if (!Array.isArray(keys)) {
//         throw new ParsingError(fieldsArg, 'Fields must be an array');
//       }
//
//       return {
//         fields: keys.map((key) => {
//           const field = fields.find((item) => item.key.name === key);
//
//           if (!field) {
//             throw new ParsingError(
//               fieldsArg,
//               `Field '${key}' not found in '${state.id.name}'`,
//             );
//           }
//
//           return { field, direction: 1 };
//         }),
//         unique: item.arguments.some((arg) => arg.key.name === 'unique'),
//       };
//     });
//
//   return [primary, ...indexes];
// };

export const generateStateStaticIndexes = (
  state: StateNode,
  fields: FieldNode[],
  indent: string,
): string => {
  const ids = fields.filter((item) =>
    item.decorators.some((item) => item.callee.name === 'id'),
  );

  // const indexes = getIndexFields(state, fields);

  return (
    `static $find: ${generateStateFindType(ids, indent)};\n` +
    `${indent}static $unique: ${generateStateUniqueType(ids, indent)};`
  );
};

const generateStateFindType = (ids: FieldNode[], indent: string): string =>
  `{${ids
    .map(
      (item) =>
        `\n${indent}  ${item.key.name}?: ${generateTypeofType(
          item.valueType,
        )};`,
    )
    .join('')}\n${indent}}`;

const generateStateUniqueType = (ids: FieldNode[], indent: string): string =>
  `{${ids
    .map(
      (item) =>
        `\n${indent}  ${item.key.name}: ${generateTypeofType(item.valueType)};`,
    )
    .join('')}\n${indent}}`;
