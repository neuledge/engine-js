import { Scalar } from '@/scalar.js';

export const BooleanScalar: Scalar<boolean> = {
  key: 'Boolean',
  encode: (value) => value,
};
