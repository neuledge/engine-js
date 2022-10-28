import { State } from './state.js';

export interface Either<S extends State = State> extends Array<S> {
  $key: string;
}
