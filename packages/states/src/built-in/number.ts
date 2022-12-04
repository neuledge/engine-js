import { BuiltInScalar } from './scalar';

export const NumberScalar: BuiltInScalar<'Number'> = {
  type: 'BuiltInScalar',
  id: { type: 'Identifier', name: 'Number' },
  description: {
    type: 'Description',
    value:
      'The `Number` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).',
  },
};
