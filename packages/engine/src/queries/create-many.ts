import { Entity } from '@/entity.js';
import { State } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { SelectQuery } from './select.js';

export interface CreateManyQuery<S extends State>
  extends SelectQuery<'CreateManyAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateManyAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'CreateManyAndReturn', S, S, R>,
    ExecQuery<EntityList<R>> {}
