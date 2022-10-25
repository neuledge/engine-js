import { Entity } from '@/entity.js';
import { State, StateCreateMutations } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery } from './exec.js';
import { MultiArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { TypeQueryOptions } from './type.js';

export interface CreateManyQuery<S extends State>
  extends SelectQuery<'CreateManyAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateManyAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'CreateManyAndReturn', S, S, R>,
    ExecQuery<EntityList<R>> {}

export interface CreateManyQueryOptions<I extends State, O extends State>
  extends TypeQueryOptions<'CreateMany', I>,
    MultiArgsQueryOptions<I, StateCreateMutations<I>>,
    SelectQueryOptions<O> {}
