import { Scalar } from '@/scalar';
import { z } from 'zod';
import { jsonShape } from './shapes';

export type ObjectScalar = object;

export const ObjectScalar: Scalar<ObjectScalar> = {
  type: 'Scalar',
  shape: jsonShape,
  name: 'Object',
  description: 'The `Object` scalar type represents any arbitrary object.',
  encode: (value) => z.object({}).parse(value),
};
