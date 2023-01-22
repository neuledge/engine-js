import { Scalar } from '@/scalar';

export type UnknownScalar = unknown;

export const UnknownScalar: Scalar<UnknownScalar> = {
  type: 'Scalar',
  name: 'Unknown',
  description:
    'The `Unknown` scalar type represents any value that can be represented by JSON.',
  encode: (value) => value,
};
