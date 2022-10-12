import { BooleanScalar } from './boolean.js';
import { NumberScalar } from './number.js';
import { BuiltInScalar } from './scalar.js';
import { StringScalar } from './string.js';

export const builtInScalars: { [K in string]: BuiltInScalar<K> } = {
  Boolean: BooleanScalar,
  Number: NumberScalar,
  String: StringScalar,
};
