import type { StateDefinition, StateName } from './definitions';

export interface NeuledgeGlob {
  stateDefinitions: Map<StateName, StateDefinition>;
}

const globKey = '__NeuledgeGlob__';

const glob = (
  typeof globalThis === 'undefined'
    ? typeof self === 'undefined'
      ? typeof window === 'undefined'
        ? typeof global === 'undefined'
          ? {}
          : global
        : window
      : self
    : globalThis
) as typeof globalThis & { [globKey]?: NeuledgeGlob };

export const neuledgeGlob = (glob[globKey] = glob[globKey] ?? {
  stateDefinitions: new Map<StateName, StateDefinition>(),
});
