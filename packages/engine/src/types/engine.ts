import { EntityListOffset } from './list.js';
import {
  MutationArguments,
  MutationName,
  MutationSelect,
  ProjectedMutationName,
} from './mutations.js';
import { ProjectionSelect } from './projection.js';
import { State } from './state.js';
import { Where, UniqueWhere } from './where.js';

// find

interface FindBasicOptions<S extends State, P extends S['Projection']> {
  states: S[];
  select: ProjectionSelect<P, S['Projection']>;
  filter?: never; // TODO filter
}

export interface FindUniqueOptions<S extends State, P extends S['Projection']>
  extends FindBasicOptions<S, P> {
  where: UniqueWhere<S>;
}

export interface FindManyOptions<S extends State, P extends S['Projection']>
  extends FindBasicOptions<S, P> {
  where?: Where<S>;
  limit?: number;
  offset?: EntityListOffset;
}

export interface FindFirstOptions<S extends State, P extends S['Projection']>
  extends FindManyOptions<S, P> {
  limit?: 1 | -1;
}

// mutate

interface MutateBasicOptions<S extends State, A extends keyof S> {
  states: S[];
  action: MutationName<A, S>;
  arguments: MutationArguments<S, A>;
  filter?: never; // TODO filter
  select?: undefined;
}

interface MutateProjectOptions<
  S extends State,
  A extends keyof S,
  P extends MutationSelect<S, A>,
> {
  states: S[];
  action: ProjectedMutationName<A, S>;
  arguments: MutationArguments<S, A>;
  filter?: never; // TODO filter
  select: ProjectionSelect<P, MutationSelect<S, A>>;
}

export interface MutateUniqueOptions<S extends State, A extends keyof S>
  extends MutateBasicOptions<S, A> {
  where: UniqueWhere<S>;
}

export interface MutateUniqueProjectOptions<
  S extends State,
  A extends keyof S,
  P extends MutationSelect<S, A>,
> extends MutateProjectOptions<S, A, P> {
  where: UniqueWhere<S>;
}

export interface MutateManyOptions<S extends State, A extends keyof S>
  extends MutateBasicOptions<S, A> {
  where?: Where<S>;
  limit?: number;
}

export interface MutateManyProjectOptions<
  S extends State,
  A extends keyof S,
  P extends MutationSelect<S, A>,
> extends MutateProjectOptions<S, A, P> {
  where?: Where<S>;
  limit?: number;
}

export interface MutateOneOptions<S extends State, A extends keyof S>
  extends MutateManyOptions<S, A> {
  limit?: 1;
}

export interface MutateOneProjectOptions<
  S extends State,
  A extends keyof S,
  P extends MutationSelect<S, A>,
> extends MutateManyProjectOptions<S, A, P> {
  limit?: 1;
}
