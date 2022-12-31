import { Either } from './either';
import { CustomScalar, Scalar } from './scalar';
import { State } from './state';
import { Void } from './void';

export type Entity<N extends string = string> =
  | Either<N>
  | State<N>
  | (Scalar & { name: N })
  | CustomScalar<N>
  | (typeof Void['name'] extends N ? typeof Void : never);
