import { StateSchema } from './Schema.js';

export interface State<
  Key extends string = string,
  Schema extends StateSchema = StateSchema,
> {
  key: Key;
  schema: Schema;
}

export const createState = <Name extends string, Schema extends StateSchema>(
  state: State<Name, Schema> | (() => State<Name, Schema>),
): State<Name, Schema> => {
  if (typeof state !== 'function') return state;

  const ref = {} as State<Name, Schema>;

  // update reference async
  Promise.resolve().then(() => Object.assign(ref, state()));

  return ref;
};
