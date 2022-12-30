import { BuiltInScalar } from '../scalar';

export const NumberScalar: BuiltInScalar<'Number'> = {
  type: 'Scalar',
  name: 'Number',
  description:
    'The `Number` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).',
};
