import { State } from '@/generated/state.js';
import { Where } from '../where.js';
import { RelationQuery } from './relation.js';

export class RelationOneQuery<S extends State, R> extends RelationQuery<
  S,
  R,
  Where<S>,
  1,
  null | undefined
> {}
