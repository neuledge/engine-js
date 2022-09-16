import { Entity } from '@/entity/index.js';
import { Projection } from '@/projection/index.js';
import { State } from '@/state/index.js';
import { StateMutation } from './state.js';

export type EntityMutations<S extends State> = {
  [K in keyof S['mutations']]: EntityMutation<S['mutations'][K]>;
};

type EntityMutation<M extends StateMutation> = [M['return']] extends [State]
  ? EntityMutationFunc<EntityMutationArguments<M>, M['return']>
  : (args: EntityMutationArguments<M>) => Promise<void>;

interface EntityMutationFunc<Args, S extends State> {
  <P extends Projection<S>>(args: Args, select: P): Promise<Entity<S, P>>;
  (args: Args): Promise<void>;
}

type EntityMutationArguments<M extends StateMutation> = M['arguments'];
