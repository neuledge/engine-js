import { BuiltInScalar } from './scalar';

export const StringScalar: BuiltInScalar<'String'> = {
  type: 'Scalar',
  name: 'String',
  description:
    'The `String` scalar type represents textual data, represented as UTF-8 character sequences.',
  builtIn: true,
};
