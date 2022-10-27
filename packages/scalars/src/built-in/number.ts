import { Scalar } from '@/scalar.js';

export const NumberScalar: Scalar<number> = {
  key: 'Number',
  encode: (value) => value,
};
