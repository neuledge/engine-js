import {
  StoreCollection,
  StoreError,
  StoreField,
  StoreJoin,
  StoreJoinChoice,
} from '@neuledge/store';
import { QueryHelpers } from './query';
import { getSelectColumn } from './select';
import { getWhere } from './where';

export const getFromJoins = (
  helpers: QueryHelpers,
  options: Pick<StoreJoinChoice, 'collection' | 'innerJoin' | 'leftJoin'>,
): {
  selectColumns: string[];
  joinFields: Record<string, StoreField>;
  fromAlias: string;
  fromJoins: string[];
  whereClauses: string[];
} | null => {
  const fromAlias = '$';

  const joins = handleStoreOptions(fromAlias, '', options);
  if (!joins.length) return null;

  const selectColumns: string[] = [];
  const joinFields: Record<string, StoreField> = {};
  const fromJoins: string[] = [];
  let whereClauses: string[] = [];

  for (const join of joins) {
    const { select, fields, fromJoin, where } = getFromJoin(helpers, join);

    selectColumns.push(...select);
    fromJoins.push(fromJoin);
    whereClauses.push(...where);
    Object.assign(joinFields, fields);
  }

  // remove where duplicates
  whereClauses = [...new Set(whereClauses)];

  return { selectColumns, joinFields, fromAlias, fromJoins, whereClauses };
};

// local helpers

const handleStoreOptions = (
  fromAlias: string,
  path: string,
  {
    innerJoin,
    leftJoin,
  }: Pick<StoreJoinChoice, 'collection' | 'innerJoin' | 'leftJoin'>,
): Join[] => {
  const joins: Join[] = [];

  if (innerJoin) {
    joins.push(...handleStoreJoin(fromAlias, path, innerJoin, true));
  }

  if (leftJoin) {
    joins.push(...handleStoreJoin(fromAlias, path, leftJoin));
  }

  return joins;
};

const handleStoreJoin = (
  fromAlias: string,
  path: string,
  join: StoreJoin,
  required?: boolean,
): Join[] =>
  Object.entries(join).flatMap(([key, choices]) =>
    handleStoreJoinChoices(
      fromAlias,
      path ? `${path}.${key}` : key,
      choices,
      required,
    ),
  );

const handleStoreJoinChoices = (
  fromAlias: string,
  key: string,
  choices: StoreJoinChoice[],
  required?: boolean,
): Join[] => {
  const joinsFrom: Record<StoreCollection['name'], Join> = {};
  const childJoins: Join[] = [];

  for (const [i, choice] of choices.entries()) {
    const { collection, by, select, where } = choice;

    let join = joinsFrom[collection.name];
    if (!join) {
      join = {
        collection,
        alias: `${key}$${i}`,
        select: {},
        ons: [],
      };
      joinsFrom[collection.name] = join;
    }

    join.ons.push({ fromAlias: fromAlias, by, where });

    if (select) {
      for (const name of Object.keys(
        select === true ? collection.fields : select,
      )) {
        join.select[`${key}$${i}.${name}`] = name;
      }
    }

    childJoins.push(...handleStoreOptions(join.alias, join.alias, choice));
  }

  const joins = Object.values(joinsFrom);
  if (required) {
    for (const join of joins) {
      join.required = joins;
    }
  }

  return [...joins, ...childJoins];
};

interface Join {
  collection: StoreCollection;
  alias: string;
  select: Record<string, string>;
  ons: {
    fromAlias: string;
    by: StoreJoinChoice['by'];
    where: StoreJoinChoice['where'];
  }[];
  required?: Join[];
}

const getFromJoin = (
  helpers: QueryHelpers,
  join: Join,
): {
  select: string[];
  fields: Record<string, StoreField>;
  fromJoin: string;
  where: string[];
} => {
  const { collection, alias: joinAlias, select, ons, required } = join;

  const joinFields: Record<string, StoreField> = {};

  const selectColumns = Object.entries(select).map(([alias, name]) => {
    joinFields[alias] = collection.fields[name];
    return getSelectColumn(helpers, joinAlias, name, alias);
  });

  let joinType: 'INNER' | 'LEFT';
  const where: string[] = [];

  if (required?.length === 1) {
    joinType = 'INNER';
  } else {
    joinType = 'LEFT';

    if (required) {
      where.push(getJoinRequiredWhere(helpers, required));
    }
  }

  const fromJoin = `${joinType} JOIN ${helpers.encodeIdentifier(
    collection.name,
  )} ${helpers.encodeIdentifier(joinAlias)} ON (${ons
    .map(({ fromAlias, by, where }) =>
      getJoinOn(helpers, collection, fromAlias, joinAlias, by, where),
    )
    .join(') OR (')})`;

  return { select: selectColumns, fields: joinFields, fromJoin, where };
};

const getJoinOn = (
  helpers: QueryHelpers,
  collection: StoreCollection,
  fromAlias: string,
  joinAlias: string,
  by: StoreJoinChoice['by'],
  where: StoreJoinChoice['where'],
): string =>
  [
    ...Object.entries(by).map(([key, term]) => {
      const field = `${helpers.encodeIdentifier(
        joinAlias,
      )}.${helpers.encodeIdentifier(key)}`;

      if (term.field) {
        return `${field} = ${helpers.encodeIdentifier(
          fromAlias,
        )}.${helpers.encodeIdentifier(term.field)}`;
      }

      if (term.value != null) {
        return `${field} = ${helpers.encodeLiteral(
          term.value,
          collection.fields[key],
        )}`;
      }

      return `${field} IS NULL`;
    }),
    ...(where ? [getWhere(helpers, collection, where, joinAlias)] : []),
  ].join(' AND ');

/**
 * Check that at least one of the required joins is not null.
 */
const getJoinRequiredWhere = (
  helpers: QueryHelpers,
  required: Join[],
): string =>
  `(${required
    .map((join) => {
      const { collection, alias } = join;

      let field = Object.keys(collection.primaryKey.fields).find(
        (name) => !collection.fields[name].nullable,
      );

      if (!field) {
        field = Object.keys(collection.fields).find(
          (name) => !collection.fields[name].nullable,
        );

        if (!field) {
          throw new StoreError(
            StoreError.Code.INVALID_DATA,
            `Cannot find a non-nullable field in collection ${collection.name}`,
          );
        }
      }

      return `${helpers.encodeIdentifier(alias)}.${helpers.encodeIdentifier(
        field,
      )} IS NOT NULL`;
    })
    .join(') OR (')})`;
