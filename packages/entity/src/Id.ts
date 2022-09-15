import { ScalarType } from '@neuledge/scalar';
import { State, StateSchema } from '@neuledge/state';

export type EntityId<S extends State> = {
  [K in IdKeys<S>]: ScalarType<S['schema'][K]['type']>;
};

// keys helpers

type IdKeys<S extends State<string, StateSchema>> = Exclude<
  {
    [K in keyof S['schema']]: [S['schema'][K]['primaryKey']] extends [true]
      ? K
      : never;
  }[keyof S['schema']],
  undefined
>;
