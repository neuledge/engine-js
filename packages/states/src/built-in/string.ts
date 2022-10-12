import { BuiltInScalar } from './scalar.js';

export const StringScalar: BuiltInScalar<'String'> = {
  type: 'BuiltInScalar',
  id: { type: 'Identifier', name: 'String' },
  // description: { type: 'Description', value: 'String type' },
};
