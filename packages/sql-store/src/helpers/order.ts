import { StoreSort } from '@neuledge/store';
import { QueryHelpers } from './query';

export const getOrderBy = (
  helpers: QueryHelpers,
  sort: StoreSort,
): string | null =>
  Object.entries(sort)
    .map(
      ([fieldName, direction]) =>
        `${helpers.encodeIdentifier(fieldName)} ${
          direction === 'asc' ? 'ASC' : 'DESC'
        }`,
    )
    .join(', ') || null;
