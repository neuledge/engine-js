import { StateDefinition } from '@/definitions';
import { Query, QueryMode } from '../query';

export interface ReturnQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
> {
  /**
   * Return the new state of the entity after the update.
   * This is the default behavior if no return option is specified.
   */
  return(returns?: 'new'): Query<M, I, O, true, null>;

  /**
   * Return the old state of the entity before the update.
   */
  return(returns: 'old'): Query<M, I, I, true, null>;
}

export interface ReturnQueryOptions {
  returns: Return;
}

export type Return = 'old' | 'new';
