import { StateDefinition } from './state';

export interface EitherDefintion<
  K extends string = string,
  S extends StateDefinition = StateDefinition,
> extends Array<S> {
  $key: K;
}

export const createEitherDefintion = <
  K extends string,
  S extends readonly StateDefinition[],
>(
  key: K,
  states: S,
): EitherDefintion<K, S[number]> => Object.assign([...states], { $key: key });
