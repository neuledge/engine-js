import { Scalar } from '@/scalar';
import { z } from 'zod';

export type ObjectScalar = object;

export const ObjectScalar: Scalar<ObjectScalar> = {
  type: 'Scalar',
  name: 'Object',
  description: 'The `Object` scalar type represents any arbitrary object.',
  encode: (value) => z.object({}).parse(value),
};
