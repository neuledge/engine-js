import { Scalar } from '@/scalar';

export type BooleanScalar = boolean;

export const BooleanScalar: Scalar<BooleanScalar> = {
  key: 'Boolean',
  encode: (value) => value,
};
