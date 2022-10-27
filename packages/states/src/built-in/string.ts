import { BuiltInScalar } from './scalar.js';

export const StringScalar: BuiltInScalar<'String'> = {
  type: 'BuiltInScalar',
  id: { type: 'Identifier', name: 'String' },
  description: {
    type: 'Description',
    value:
      'The `String` scalar type represents textual data, represented as UTF-8 character sequences.',
  },
};
