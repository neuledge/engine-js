import type { StateDefinition, StateName } from './definitions';

export interface NeuledgeGlob {
  stateDefinitions: Map<StateName, StateDefinition>;
}

const globKey = '__NeuledgeGlob__';

const glob = (
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : {}
) as typeof globalThis & { [globKey]?: NeuledgeGlob };

export const neuledgeGlob = (glob[globKey] = glob[globKey] ?? {
  stateDefinitions: new Map<StateName, StateDefinition>(),
});
