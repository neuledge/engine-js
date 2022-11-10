import { Scalar } from '@/scalar.js';

export const DateScalar: Scalar<Date> = {
  key: 'Date',
  encode: (value) => value,
};
