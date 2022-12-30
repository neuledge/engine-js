import { BuiltInScalar } from '../scalar';

export const BufferScalar: BuiltInScalar<'Buffer'> = {
  type: 'Scalar',
  name: 'Buffer',
  description:
    'The `Buffer` scalar type represents raw data is stored in array of integers.',
};
