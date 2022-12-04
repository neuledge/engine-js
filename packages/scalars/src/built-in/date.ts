import { Scalar } from '@/scalar';

export const DateScalar: Scalar<Date> = {
  key: 'Date',
  encode: (value) => value,
};
