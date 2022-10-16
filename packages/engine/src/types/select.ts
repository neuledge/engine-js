import { EntityListOffset } from './list.js';
import { Merge, Subset } from './utils.js';

export type Select<T> = { [K in keyof T]?: boolean | ListSelect<T[K]> };

export type ListSelect<T> = Select<T> & {
  $limit?: number | null;
  $offset?: EntityListOffset | null;
};

export type StateSelection<S, P extends object> = Subset<S, Merge<P>>;
