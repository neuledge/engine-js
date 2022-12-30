import { Entity } from '@/entity';
import { BuiltInScalar } from '@/scalar';
import { BooleanScalar } from './boolean';
import { DateTimeScalar } from './date-time';
import { NumberScalar } from './number';
import { StringScalar } from './string';
import { Void } from './void';

export * from './boolean';
export * from './date-time';
export * from './number';
export * from './object';
export * from './string';
export * from './void';

export const builtInScalars: { [K in string]: BuiltInScalar<K> } = {
  Boolean: BooleanScalar,
  DateTime: DateTimeScalar,
  Number: NumberScalar,
  String: StringScalar,
};

export const builtIn: { [K in string]: Entity<K> } = {
  ...builtInScalars,
  Void,
};
