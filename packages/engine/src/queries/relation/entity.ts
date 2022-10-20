import { State, StateRelations } from '@/generated/index.js';
import { EntityList } from '@/list.js';

export type EntityRelation<
  S extends State,
  K extends keyof StateRelations<S>,
  T,
  R,
> = Omit<T, K> &
  (StateRelations<S>[K] extends readonly [readonly State[]]
    ? { [k in K]: EntityList<R> }
    : undefined extends InstanceType<S>[K]
    ? { [k in K]?: R | null }
    : { [k in K]: R });
