import { Scalar } from './scalar';

export type ScalarGenerator<
  Args extends Record<string, unknown> = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
  Value = Type,
> = (args: Args) => Scalar<Type, Input, Value>;

export type ScalarGeneratorScalar<
  Args extends Record<string, unknown> = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
  Value = Type,
> = Scalar<Type, Input, Value> & ScalarGenerator<Args, Type, Input, Value>;

export const createScalarGenerator = <
  Args extends Record<string, unknown>,
  Type,
  Input,
  Value,
>(
  generator: ScalarGenerator<Args, Type, Input, Value>,
): ScalarGenerator<Args, Type, Input, Value> => generator;

export const createScalarGeneratorScalar = <
  Args extends Record<string, unknown>,
  Type,
  Input,
  Value,
>(
  generator: ScalarGenerator<Args | Record<string, never>, Type, Input, Value>,
): ScalarGeneratorScalar<Args, Type, Input, Value> =>
  Object.assign(generator, generator({}));
