import { ParsingError } from '@neuledge/states-parser';
import { ScalarField, State, StateSortingIndex } from '@neuledge/states';
import { generateWhereEntityExpression } from '../entity';
import { generateTypeScalar } from '../type';

export const generateStateIdType = (state: State): string => {
  const { fields, auto } = state.primaryKey;

  const keys = Object.entries(fields).map(
    ([name, dir]) => `'${dir === 'asc' ? '+' : '-'}${name}'`,
  );

  return `{ fields: [${keys.join(', ')}]${auto ? `, auto: '${auto}'` : ''} }`;
};

export const generateStateQueryIndexes = (
  state: State,
  indent: string,
): string =>
  `static $where: ${generateStateWhereType(state, indent)};\n` +
  `${indent}static $unique: ${generateStateUniqueType(state, indent)};\n` +
  `${indent}static $filter: ${generateStateFilterType(state, indent)};`;

export const generateStateOptionalIndexes = (
  state: State,
  indent: string,
): string | null => {
  const indexes = Object.values(state.indexes).filter(
    (index) => index.name !== state.primaryKey.name,
  );

  if (!indexes.length) {
    return null;
  }

  return (
    `{` +
    indexes
      .map(
        (index) =>
          `\n${indent}  ${
            /^\w+$/.test(index.name)
              ? index.name
              : `'${index.name.replace(/['\\]/g, '\\$1')}'`
          }: { fields: [${Object.entries(index.fields)
            .map(([field, sort]) => `'${sort === 'asc' ? `+` : '-'}${field}'`)
            .join(', ')}]${index.unique ? ', unique: true' : ''} } as const,`,
      )
      .join('') +
    `\n${indent}}`
  );
};

const generateStateFilterType = (state: State, indent: string): string =>
  `{${Object.values(state.fields)
    .filter((field) => field.type === 'ScalarField')
    .map(
      (item) =>
        `\n${indent}  ${item.name}?: ${generateWhereEntityExpression(
          item.as,
          item.nullable,
        )} | null;`,
    )
    .join('')}\n${indent}}`;

const generateStateWhereType = (state: State, indent: string): string => {
  const paths = getIndexTypePaths(state, Object.values(state.indexes));
  const multiPaths = paths.length > 1 || paths[0].length > 1;

  return paths
    .flatMap((fields) =>
      fields.map(
        (field, i) =>
          `${multiPaths ? `\n${indent}  | {` : '{'}${fields
            .slice(0, i)
            .map(
              (item) =>
                `\n${multiPaths ? `${indent}    ` : indent}  ${
                  item.name
                }: ${generateWhereEntityExpression(item.as, item.nullable)};`,
            )
            .join('')}\n${indent}${multiPaths ? '    ' : ''}  ${
            field.name
          }?: ${generateWhereEntityExpression(
            field.as,
            field.nullable,
          )} | null;${fields
            .slice(i + 1)
            .map(
              (item) =>
                `\n${multiPaths ? `${indent}    ` : indent}  ${
                  item.name
                }?: null;`,
            )
            .join('')}\n${multiPaths ? `${indent}    ` : indent}}`,
      ),
    )
    .join(multiPaths ? '' : ' | ');
};

const generateStateUniqueType = (state: State, indent: string): string =>
  getIndexTypePaths(
    state,
    Object.values(state.indexes).filter((index) => index.unique),
  )
    .map(
      (fields) =>
        `{${fields
          .map(
            (item) =>
              `\n${indent}  ${item.name}: ${generateTypeScalar(item.as)};`,
          )
          .join('')}\n${indent}}`,
    )
    .join(' | ');

const getIndexTypePaths = (
  state: State,
  indexes: StateSortingIndex[],
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
          throw new ParsingError(
            state.node,
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
