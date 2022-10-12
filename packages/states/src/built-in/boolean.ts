import { BuiltInScalar } from './scalar.js';

export const BooleanScalar: BuiltInScalar<'Boolean'> = {
  type: 'BuiltInScalar',
  id: { type: 'Identifier', name: 'Boolean' },
  // description: { type: 'Description', value: 'String type' },
};
