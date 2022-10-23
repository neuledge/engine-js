import { State } from '@/generated/index.js';
import { Merge } from '../utils.js';

export type Select<S extends State> = {
  [K in keyof Merge<InstanceType<S>>]?: boolean;
};
