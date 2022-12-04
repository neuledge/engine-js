import { Scalar } from '@/scalar';

export const NumberScalar: Scalar<number> = {
  key: 'Number',
  encode: (value) => value,
};
