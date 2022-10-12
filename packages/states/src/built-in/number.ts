import { BuiltInScalar } from './scalar.js';

export const NumberScalar: BuiltInScalar<'Number'> = {
  type: 'BuiltInScalar',
  id: { type: 'Identifier', name: 'Number' },
  // description: { type: 'Description', value: 'String type' },
};
