import { State } from './state/index.js';

export interface Either<K extends string = string, S extends State = State>
  extends Array<S> {
  $key: K;
}

export const createEither = <K extends string, S extends readonly State[]>(
  key: K,
  states: S,
): Either<K, S[number]> => Object.assign([...states], { $key: key });
