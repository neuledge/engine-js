import { Scalar } from '@/scalar';

export type BufferScalar = Buffer;

export const BufferScalar: Scalar<BufferScalar> = {
  key: 'Buffer',
  encode: (value) => value,
};
