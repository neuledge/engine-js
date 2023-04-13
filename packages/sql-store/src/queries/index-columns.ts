import { StoreIndex } from '@neuledge/store';

export const indexColumns = (index: StoreIndex): string =>
  Object.entries(index.fields)
    .map(([key, val]) => `${key} ${val.sort === 'desc' ? 'DESC' : 'ASC'}`)
    .join(', ');
