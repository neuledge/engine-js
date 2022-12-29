import { Scalar } from '@/scalar';

export type DateTimeScalar = Date;

export const DateTimeScalar: Scalar<DateTimeScalar> = {
  key: 'Date',
  encode: (value) => value,
};
