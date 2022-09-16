import { Scalar } from '@neuledge/scalar';
import { type State } from './state/index.js';

export type StateFieldType =
  | Scalar
  | UnionType<State>
  | ArrayType<Scalar>
  | ArrayType<UnionType<State>>;

export type UnionType<T> = T[];
export type ArrayType<T> = [T];
