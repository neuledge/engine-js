import { Scalar } from '@/scalar';
import { jsonShape } from './shapes';

export type UnknownScalar = unknown;

export const UnknownScalar: Scalar<UnknownScalar> = {
  type: 'Scalar',
  shape: jsonShape,
  name: 'Unknown',
  description:
    'The `Unknown` scalar type represents any value that can be represented by JSON.',
  encode: (value) => value,
};
