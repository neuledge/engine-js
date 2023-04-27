import {
  StoreCollection,
  StoreError,
  StoreJoin,
  StoreJoinChoice,
} from '@neuledge/store';
import { QueryHelpers } from '../query';
import { getSelectColumn } from '../select';

export const getFromJoins = (
  helpers: QueryHelpers,
  options: Pick<StoreJoinChoice, 'collection' | 'innerJoin' | 'leftJoin'>,
): {
  selectColumns: string[];
  fromAlias: string;
  fromJoins: string[];
  whereClauses: string[];
} | null => {
  const fromAlias = '$';

  const joins = handleStoreOptions(fromAlias, options);
  if (!joins.length) return null;

  const selectColumns: string[] = [];
  const fromJoins: string[] = [];
  let whereClauses: string[] = [];

  for (const join of joins) {
    const { select, fromJoin, where } = getFromJoin(helpers, join);

    selectColumns.push(...select);
    fromJoins.push(fromJoin);
    whereClauses.push(...where);
  }

  // remove where duplicates
  whereClauses = [...new Set(whereClauses)];

  return { selectColumns, fromAlias, fromJoins, whereClauses };
};

// local helpers

const handleStoreOptions = (
  fromAlias: string,
  {
    innerJoin,
    leftJoin,
  }: Pick<StoreJoinChoice, 'collection' | 'innerJoin' | 'leftJoin'>,
): Join[] => {
  const joins: Join[] = [];

  if (innerJoin) {
    joins.push(...handleStoreJoin(fromAlias, innerJoin, true));
  }

  if (leftJoin) {
    joins.push(...handleStoreJoin(fromAlias, leftJoin));
  }

  return joins;
};

const handleStoreJoin = (
  fromAlias: string,
  join: StoreJoin,
  required?: boolean,
): Join[] =>
  Object.entries(join).flatMap(([key, choices]) =>
    handleStoreJoinChoices(fromAlias, key, choices, required),
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

    // join with where are tricky. if it's done with inner join, it will
    // remove the parent document if the join is not found. If it's done
    // with left join, it will keep the parent document even if the join
    // is not found. This is problematic when we have multiple join choices
    // for the same collection but with different where clauses or from
    // different join choices set.

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

    join.ons.push({ fromAlias: fromAlias, by });

    if (select) {
      for (const name of Object.keys(
        select === true ? collection.fields : select,
      )) {
        join.select[`${key}$${i}.${name}`] = name;
      }
    }

    childJoins.push(...handleStoreOptions(join.alias, choice));
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
  ons: { fromAlias: string; by: StoreJoinChoice['by'] }[];
  required?: Join[];
}

const getFromJoin = (
  helpers: QueryHelpers,
  join: Join,
): { select: string[]; fromJoin: string; where: string[] } => {
  const { collection, alias: joinAlias, select, ons, required } = join;

  const selectColumns = Object.entries(select).map(([alias, name]) =>
    getSelectColumn(helpers, joinAlias, name, alias),
  );

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
    .map(({ fromAlias, by }) => getJoinOn(helpers, fromAlias, joinAlias, by))
    .join(') OR (')})`;

  return { select: selectColumns, fromJoin, where };
};

const getJoinOn = (
  helpers: QueryHelpers,
  fromAlias: string,
  joinAlias: string,
  by: StoreJoinChoice['by'],
): string =>
  Object.entries(by)
    .map(([key, term]) => {
      const field = `${helpers.encodeIdentifier(
        joinAlias,
      )}.${helpers.encodeIdentifier(key)}`;

      if (term.field) {
        return `${field} = ${helpers.encodeIdentifier(
          fromAlias,
        )}.${helpers.encodeIdentifier(term.field)}`;
      }

      if (term.value != null) {
        return `${field} = ${helpers.encodeLiteral(term.value)}`;
      }

      return `${field} IS NULL`;
    })
    .join(' AND ');

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
