import { Entity } from '@/entity';
import { StateDefinition, StateDefinitionCreateMutations } from '@/definitions';
import { EntityList } from '@/list';
import { ExecQuery, ExecQueryOptions } from './exec';
import { MultiArgsQueryOptions } from './method';
import { RetriveQuery, RetriveQueryOptions } from './retrive';
import { RootQueryOptions } from './type';

export interface CreateManyQuery<S extends StateDefinition>
  extends RetriveQuery<'CreateManyAndReturn', S, S, Entity<S>>,
    ExecQuery<void> {}

export interface CreateManyAndReturnQuery<
  S extends StateDefinition,
  R = Entity<S>,
> extends RetriveQuery<'CreateManyAndReturn', S, S, R>,
    ExecQuery<EntityList<R>> {}

export interface CreateManyQueryOptions<
  I extends StateDefinition,
  O extends StateDefinition,
> extends RootQueryOptions<'CreateMany', I>,
    MultiArgsQueryOptions<I, StateDefinitionCreateMutations<I>>,
    RetriveQueryOptions<O>,
    ExecQueryOptions<'CreateMany', I, O> {
  states: [I];
}
