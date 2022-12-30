import { BuiltInScalar } from '../scalar';

export const ObjectScalar: BuiltInScalar<'Object'> = {
  type: 'Scalar',
  name: 'Object',
  description:
    'The `Object` scalar type represents the non-primitive type, i.e. anything that is not Number, String, Boolean or null.',
};
