import {
  CreationArguments,
  CreationName,
  CreationSelect,
} from './creations.js';
import { EntityListOffset } from './list.js';
import {
  MutationArguments,
  MutationName,
  MutationSelect,
  ProjectedMutationName,
} from './mutations.js';
import { State, StateProjection } from './state.js';
import { Merge, Subset } from './utils.js';
import { Where, UniqueWhere } from './where.js';

// find

type FindSelect<S, P extends object> = Subset<S, Merge<P>>;

interface FindBaseOptions<S extends State> {
  states: S[];
  filter?: never; // TODO filter
}

interface FindBasicOptions<S extends State> extends FindBaseOptions<S> {
  select?: undefined;
}

interface FindBasicProjectOptions<S extends State, P extends StateProjection<S>>
  extends FindBaseOptions<S> {
  select: FindSelect<P, StateProjection<S>>;
}

export interface FindUniqueOptions<S extends State>
  extends FindBasicOptions<S> {
  where: UniqueWhere<S>;
}

export interface FindUniqueProjectOptions<
  S extends State,
  P extends StateProjection<S>,
> extends FindBasicProjectOptions<S, P> {
  where: UniqueWhere<S>;
}

export interface FindManyOptions<S extends State> extends FindBasicOptions<S> {
  where?: Where<S> | null;
  limit?: number | null;
  offset?: EntityListOffset | null;
}

export interface FindManyProjectOptions<
  S extends State,
  P extends StateProjection<S>,
> extends FindBasicProjectOptions<S, P> {
  where?: Where<S> | null;
  limit?: number | null;
  offset?: EntityListOffset | null;
}

export interface FindFirstOptions<S extends State> extends FindManyOptions<S> {
  limit?: 1 | -1 | null;
}

export interface FindFirstProjectOptions<
  S extends State,
  P extends StateProjection<S>,
> extends FindManyProjectOptions<S, P> {
  limit?: 1 | -1 | null;
}

// create

interface CreateBaseOptions<S extends State, A extends keyof S> {
  state: S;
  action: CreationName<S, A>;
}

interface CreateBasicOptions<S extends State, A extends keyof S>
  extends CreateBaseOptions<S, A> {
  select?: true | null;
}

interface CreateVoidOptions<S extends State, A extends keyof S>
  extends CreateBaseOptions<S, A> {
  select: false;
}

interface CreateProjectOptions<
  S extends State,
  A extends keyof S,
  P extends CreationSelect<S>,
> extends CreateBaseOptions<S, A> {
  select?: FindSelect<P, CreationSelect<S>> | null;
}

export interface CreateOneOptions<S extends State, A extends keyof S>
  extends CreateBasicOptions<S, A> {
  arguments: CreationArguments<S, A>;
}

export interface CreateOneVoidOptions<S extends State, A extends keyof S>
  extends CreateVoidOptions<S, A> {
  arguments: CreationArguments<S, A>;
}

export interface CreateOneProjectOptions<
  S extends State,
  A extends keyof S,
  P extends CreationSelect<S>,
> extends CreateProjectOptions<S, A, P> {
  arguments: CreationArguments<S, A>;
}

export interface CreateManyOptions<S extends State, A extends keyof S>
  extends CreateBasicOptions<S, A> {
  arguments: CreationArguments<S, A>[];
}

export interface CreateManyVoidOptions<S extends State, A extends keyof S>
  extends CreateVoidOptions<S, A> {
  arguments: CreationArguments<S, A>[];
}

export interface CreateManyProjectOptions<
  S extends State,
  A extends keyof S,
  P extends CreationSelect<S>,
> extends CreateProjectOptions<S, A, P> {
  arguments: CreationArguments<S, A>[];
}

// mutate

interface MutateBaseOptions<S extends State, A extends keyof S> {
  states: S[];
  arguments: MutationArguments<S, A>;
  filter?: null; // TODO filter
}

interface MutateBasicOptions<S extends State, A extends keyof S>
  extends MutateBaseOptions<S, A> {
  action: MutationName<S, A>;
  select?: false | null;
}

interface MutateReturnOptions<S extends State, A extends keyof S>
  extends MutateBaseOptions<S, A> {
  action: ProjectedMutationName<S, A>;
  select: true;
}

interface MutateProjectOptions<
  S extends State,
  A extends keyof S,
  P extends MutationSelect<S, A>,
> extends MutateBaseOptions<S, A> {
  action: ProjectedMutationName<S, A>;
  select: FindSelect<P, MutationSelect<S, A>>;
}

export interface MutateUniqueOptions<S extends State, A extends keyof S>
  extends MutateBasicOptions<S, A> {
  where: UniqueWhere<S>;
}

export interface MutateUniqueReturnOptions<S extends State, A extends keyof S>
  extends MutateReturnOptions<S, A> {
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
  where?: Where<S> | null;
  limit?: number | null;
}

export interface MutateManyReturnOptions<S extends State, A extends keyof S>
  extends MutateReturnOptions<S, A> {
  where?: Where<S> | null;
  limit?: number | null;
}

export interface MutateManyProjectOptions<
  S extends State,
  A extends keyof S,
  P extends MutationSelect<S, A>,
> extends MutateProjectOptions<S, A, P> {
  where?: Where<S> | null;
  limit?: number | null;
}

export interface MutateOneOptions<S extends State, A extends keyof S>
  extends MutateManyOptions<S, A> {
  limit?: 1 | null;
}

export interface MutateOneReturnOptions<S extends State, A extends keyof S>
  extends MutateReturnOptions<S, A> {
  limit?: 1 | null;
}

export interface MutateOneProjectOptions<
  S extends State,
  A extends keyof S,
  P extends MutationSelect<S, A>,
> extends MutateManyProjectOptions<S, A, P> {
  limit?: 1 | null;
}
