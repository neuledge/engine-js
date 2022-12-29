import { Scalar } from '@/scalar';

export type NumberScalar = number;

export const NumberScalar: Scalar<NumberScalar> = {
  key: 'Number',
  encode: (value) => value,
};
