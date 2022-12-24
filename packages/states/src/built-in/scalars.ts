import { BooleanScalar } from './boolean';
import { DateTimeScalar } from './date-time';
import { NumberScalar } from './number';
import { BuiltInScalar } from './scalar';
import { StringScalar } from './string';

export const builtInScalars: { [K in string]: BuiltInScalar<K> } = {
  Boolean: BooleanScalar,
  DateTime: DateTimeScalar,
  Number: NumberScalar,
  String: StringScalar,
};
