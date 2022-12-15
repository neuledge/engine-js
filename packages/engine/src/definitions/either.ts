import { StateDefinition } from './state';

export interface EitherDefintion<
  N extends string = string,
  S extends StateDefinition = StateDefinition,
> extends Array<S> {
  $name: N;
}

export const createEitherDefintion = <
  N extends string,
  S extends StateDefinition,
>(
  name: N,
  states: readonly S[],
): EitherDefintion<N, S> => Object.assign([...states], { $name: name });
