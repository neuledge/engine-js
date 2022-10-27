import { State } from '@/generated/index.js';
import { QueryOptions, QueryType } from '@/queries/index.js';
import { Store } from '@/store/index.js';

type ExecFn = <T extends QueryType, I extends State, O extends State>(
  this: QueryOptions<T, I, O>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;

export const createExec = (store: Store): ExecFn =>
  async function () {
    console.log(store, this);

    throw new Error('Not implemented');
  };
