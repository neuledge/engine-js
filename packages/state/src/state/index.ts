import { StateMutations } from '@/mutations/index.js';
import { StateSchema } from './schema.js';

export interface State<
  Key extends string = string,
  Schema extends StateSchema = StateSchema,
  Mutations extends StateMutations = StateMutations,
> {
  key: Key;
  schema: Schema;
  mutations: Mutations;
}

export const createState = <
  Name extends string,
  Schema extends StateSchema,
  Mutations extends StateMutations,
>(
  state: State<Name, Schema> | (() => State<Name, Schema, Mutations>),
): State<Name, Schema> => {
  if (typeof state !== 'function') return state;

  const reference = {} as State<Name, Schema>;

  // update reference async
  Promise.resolve().then(() => Object.assign(reference, state()));

  return reference;
};
