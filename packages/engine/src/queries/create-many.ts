import { Entity } from '@/entity.js';
import { State, StateCreateMutations } from '@/generated/index.js';
import { EntityList } from '@/list.js';
import { ExecQuery, ExecQueryOptions } from './exec.js';
import { MultiArgsQueryOptions } from './method.js';
import { SelectQuery, SelectQueryOptions } from './select.js';
import { RootQueryOptions } from './type.js';

export interface CreateManyQuery<S extends State>
  extends SelectQuery<'CreateManyAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateManyAndReturnQuery<S extends State, R = Entity<S>>
  extends SelectQuery<'CreateManyAndReturn', S, S, R>,
    ExecQuery<EntityList<R>> {}

export interface CreateManyQueryOptions<I extends State, O extends State>
  extends RootQueryOptions<'CreateMany', I>,
    MultiArgsQueryOptions<I, StateCreateMutations<I>>,
    SelectQueryOptions<O>,
    ExecQueryOptions<'CreateMany', I, O> {}
