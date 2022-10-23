import { EntityList } from '@/list.js';
import { AbstractSelectQuery } from './abstract.js';

export type SelectLogic =
  | SelectFirstLogic
  | SelectFirstOrThrowLogic
  | SelectManyLogic;

export type SelectFirstLogic = <R>(
  this: SelectLogicInstance,
  items: EntityList<R>,
) => R | undefined;

export type SelectFirstOrThrowLogic = <R>(
  this: SelectLogicInstance,
  items: EntityList<R>,
) => R;

export type SelectManyLogic = <R>(
  this: SelectLogicInstance,
  items: EntityList<R>,
) => EntityList<R>;

export type SelectLogicResponse<
  R,
  L extends SelectLogic,
> = L extends SelectFirstOrThrowLogic
  ? R
  : L extends SelectFirstLogic
  ? R | undefined
  : L extends SelectManyLogic
  ? EntityList<R>
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SelectLogicInstance = AbstractSelectQuery<any>;
