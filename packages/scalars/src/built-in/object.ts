import { Scalar } from '@/scalar';

export type ObjectScalar = object;

export const ObjectScalar: Scalar<ObjectScalar> = {
  key: 'Object',
  encode: (value) => value,
};
