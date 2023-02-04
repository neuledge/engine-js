import { StateDefinition } from '@/definitions';
import { Query, QueryMode } from './query';

export interface AlterReturnQuery<
  M extends QueryMode,
  I extends StateDefinition,
  O extends StateDefinition,
> {
  /**
   * Return the new state of the entity after the update.
   * This is the default behavior if no return option is specified.
   */
  return(returns?: 'new'): Query<M, I, O>;

  /**
   * Return the old state of the entity before the update.
   */
  return(returns: 'old'): Query<M, I, I>;
}

export interface AlterReturnQueryOptions {
  returns?: Return | null;
}

export interface InitReturnQuery<
  M extends QueryMode,
  S extends StateDefinition,
> {
  /**
   * Return the new state of the entity after the update.
   * This is the default behavior if no return option is specified.
   */
  return(returns?: 'new'): Query<M, S, S>;
}

export interface InitReturnQueryOptions {
  returns?: 'new' | null;
}

export type Return = 'old' | 'new';
