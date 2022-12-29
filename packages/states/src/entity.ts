import { BuiltInScalar, Scalar } from './built-in';
import { Either } from './either';
import { State } from './state';

export type Entity = Either | State | Scalar | BuiltInScalar;
