import { BooleanScalar } from './boolean.js';
import { NumberScalar } from './number.js';
import { StringScalar } from './string.js';

export * from './boolean.js';
export * from './number.js';
export * from './string.js';

export const scalars = {
  String: StringScalar,
  Number: NumberScalar,
  Boolean: BooleanScalar,
};
