import { StoreCollection, StoreSelect } from '@neuledge/store';
import { QueryHelpers } from './query';

export const getSelectColumns = (
  helpers: QueryHelpers,
  from: string | null,
  select: StoreSelect | StoreCollection['fields'],
): string[] =>
  Object.keys(select)
    .filter((key) => select[key])
    .map((name) => getSelectColumn(helpers, from, name));

export const getSelectColumn = (
  helpers: QueryHelpers,
  from: string | null,
  name: string,
  alias?: string | null,
): string =>
  `${
    from ? `${helpers.encodeIdentifier(from)}.` : ''
  }${helpers.encodeIdentifier(name)}${
    alias ? ` AS ${helpers.encodeIdentifier(alias)}` : ''
  }`;

export const getSelectAny = (
  helpers: QueryHelpers,
  from: string | null,
): string => `${from ? `${helpers.encodeIdentifier(from)}.` : ''}*`;
