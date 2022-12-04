import { Scalar } from '@/scalar';

export const BufferScalar: Scalar<Buffer> = {
  key: 'Buffer',
  encode: (value) => value,
};
