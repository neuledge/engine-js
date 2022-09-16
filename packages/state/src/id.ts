import { Scalar } from '@neuledge/scalar';
import { State } from './state/index.js';

export type EntityId<S extends State> = {
  [K in IdKeys<S>]: S extends Scalar<infer T, never, never> ? T : never;
};

// keys helpers

type IdKeys<S extends State> = Exclude<
  {
    [K in keyof S['schema']]: [S['schema'][K]['primaryKey']] extends [true]
      ? K
      : never;
  }[keyof S['schema']],
  undefined
>;
