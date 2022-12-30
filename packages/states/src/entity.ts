import { Void } from './built-in';
import { Either } from './either';
import { Scalar } from './scalar';
import { State } from './state';

export type Entity<N extends string = string> =
  | Either<N>
  | State<N>
  | Scalar<N>
  | (typeof Void['name'] extends N ? typeof Void : never);
