import { BuiltInScalar } from './scalar';

export const BooleanScalar: BuiltInScalar<'Boolean'> = {
  type: 'Scalar',
  name: 'Boolean',
  description: 'The `Boolean` scalar type represents `true` or `false`.',
  builtIn: true,
};
