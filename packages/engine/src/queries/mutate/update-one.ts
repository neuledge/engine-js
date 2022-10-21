import {
  State,
  StateActionArguments,
  StateTransformActions,
  StateUpdateActions,
} from '@/generated/index.js';
import { MutateQuery } from './mutate.js';

export class UpdateOneQuery<
  S extends State,
  K extends StateUpdateActions<S> | StateTransformActions<S>,
  A extends StateActionArguments<S, K>,
> extends MutateQuery<S, K, A> {}
