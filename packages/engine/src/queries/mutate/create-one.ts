import {
  State,
  StateActionArguments,
  StateCreateActions,
} from '@/generated/index.js';
import { MutateQuery } from './mutate.js';

export class CreateOneQuery<
  S extends State,
  K extends StateCreateActions<S>,
  A extends StateActionArguments<S, K>,
> extends MutateQuery<S, K, A> {}
