import { ScalarField, State, StateIndex } from '@neuledge/states';
import { generateEntityType, generateWhereEntity } from '../entity';

export const generateStateIdType = (state: State): string =>
  `[${Object.entries(state.primaryKey.fields)
    .map(([name, dir]) => `'${dir === 'asc' ? '+' : '-'}${name}'`)
    .join(', ')}]`;

export const generateStateStaticIndexes = (
  state: State,
  indent: string,
): string =>
  `static $find: $.Where<${generateStateFindType(state, indent)}>;\n` +
  `${indent}static $unique: ${generateStateUniqueType(state, indent)};`;

const generateStateFindType = (state: State, indent: string): string => {
  const paths = getIndexTypePaths(state, state.indexes);
  const multiPaths = paths.length > 1 || paths[0].length > 1;

  return (
    paths
      .flatMap((fields) =>
        fields.map(
          (field, i) =>
            `${multiPaths ? `\n${indent}  | {` : '{'}${fields
              .slice(0, i)
              .map(
                (item) =>
                  `\n${multiPaths ? `${indent}    ` : indent}  ${
                    item.name
                  }: ${generateWhereEntity(item.entity, item.nullable)};`,
              )
              .join('')}\n${indent}${multiPaths ? '    ' : ''}  ${
              field.name
            }?: ${generateWhereEntity(field.entity, field.nullable)};\n${
              multiPaths ? `${indent}    ` : indent
            }}`,
        ),
      )
      .join(multiPaths ? '' : ' | ') + (multiPaths ? `\n${indent}` : '')
  );
};

const generateStateUniqueType = (state: State, indent: string): string =>
  getIndexTypePaths(
    state,
    state.indexes.filter((index) => index.unique),
  )
    .map(
      (fields) =>
        `{${fields
          .map(
            (item) =>
              `\n${indent}  ${item.name}: ${generateEntityType(item.entity)};`,
          )
          .join('')}\n${indent}}`,
    )
    .join(' | ');

const getIndexTypePaths = (
  state: State,
  indexes: StateIndex[],
): ScalarField[][] => {
  type FieldMap = Map<string, { children: FieldMap; field: ScalarField }>;
  const fields: FieldMap = new Map();

  for (const index of indexes) {
    let current = fields;

    for (const key of Object.keys(index.fields)) {
      let entry = current.get(key);
      if (!entry) {
        const field = state.fields[key];
        if (field?.type !== 'ScalarField') {
          throw new Error(
            `Index field '${key}' not found in state '${state.name}'`,
          );
        }

        entry = { children: new Map(), field };
        current.set(key, entry);
      }

      current = entry.children;
    }
  }

  const result: ScalarField[][] = [];

  const walk = (current: FieldMap, path: ScalarField[]): void => {
    for (const [, entry] of current) {
      const newPath = [...path, entry.field];

      if (!entry.children.size) {
        result.push(newPath);
        continue;
      }

      walk(entry.children, newPath);
    }
  };

  walk(fields, []);

  return result;
};
