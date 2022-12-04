import { Scalar } from '@/scalar';

export const BooleanScalar: Scalar<boolean> = {
  key: 'Boolean',
  encode: (value) => value,
};
