import { OffsetQueryOptions } from '@/queries/index.js';
import { StoreFindOptions } from '@/store/index.js';

export const convertOffsetQuery = ({
  offset,
}: OffsetQueryOptions): Pick<StoreFindOptions, 'offset'> =>
  offset != null ? { offset } : {};
