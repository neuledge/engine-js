import { Scalar } from '@/scalar.js';

export const BufferScalar: Scalar<Buffer> = {
  key: 'Buffer',
  encode: (value) => value,
};
