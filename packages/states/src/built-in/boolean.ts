import { BuiltInScalar } from './scalar';

export const BooleanScalar: BuiltInScalar<'Boolean'> = {
  type: 'BuiltInScalar',
  id: { type: 'Identifier', name: 'Boolean' },
  description: {
    type: 'Description',
    value: 'The `Boolean` scalar type represents `true` or `false`.',
  },
};
