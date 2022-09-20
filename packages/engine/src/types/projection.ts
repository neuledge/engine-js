import { Merge, Subset } from './utils.js';

export type Projection<T> = { [K in keyof T]?: boolean };

export type ProjectionSelect<S, P extends object> = Subset<S, Merge<P>>;
