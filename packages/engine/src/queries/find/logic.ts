import { EntityList } from '@/list.js';
import { AbstractRelationQuery } from '../relation/index.js';

export type FindLogic = FindFirstLogic | FindFirstOrThrowLogic | FindManyLogic;

export type FindFirstLogic = <R>(
  this: FindLogicInstance,
  items: EntityList<R>,
) => R | undefined;

export type FindFirstOrThrowLogic = <R>(
  this: FindLogicInstance,
  items: EntityList<R>,
) => R;

export type FindManyLogic = <R>(
  this: FindLogicInstance,
  items: EntityList<R>,
) => EntityList<R>;

export type FindLogicResponse<
  R,
  L extends FindLogic,
> = L extends FindFirstOrThrowLogic
  ? R
  : L extends FindFirstLogic
  ? R | undefined
  : L extends FindManyLogic
  ? EntityList<R>
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FindLogicInstance = AbstractRelationQuery<any, any, any, any>;
