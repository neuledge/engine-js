import {
  State,
  StateMethodArguments,
  StateTransformMethods,
  StateUpdateMethods,
} from '@/generated/index.js';
import { MutateQuery } from './mutate.js';

export class UpdateUniqueOrThrowQuery<
  S extends State,
  K extends StateUpdateMethods<S> | StateTransformMethods<S>,
  A extends StateMethodArguments<S, K>,
> extends MutateQuery<S, K, A> {}
