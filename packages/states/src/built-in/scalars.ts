import { BooleanScalar } from './boolean';
import { NumberScalar } from './number';
import { BuiltInScalar } from './scalar';
import { StringScalar } from './string';

export const builtInScalars: { [K in string]: BuiltInScalar<K> } = {
  Boolean: BooleanScalar,
  Number: NumberScalar,
  String: StringScalar,
};
