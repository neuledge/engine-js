export interface Scalar<
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
  Value = Type,
> {
  encode: (value: Input) => Value | PromiseLike<Value>;
  decode?: (value: Value) => Type | PromiseLike<Type>;
}

export type ScalarType<S extends Scalar> = S extends Scalar<
  infer T,
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>
  ? T
  : never;

export type ScalarInput<S extends Scalar> = S extends Scalar<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  infer T,
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>
  ? T
  : never;

export type ScalarValue<S extends Scalar> = S extends Scalar<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  infer T
>
  ? T
  : never;

export type ScalarFunction<
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
> = (value: Input) => Type | PromiseLike<Type>;

export const createScalar = <Type, Input, Value>(
  scalar:
    | Scalar<Type, Input, Value>
    | (ScalarFunction<Type, Input> & ScalarFunction<Value, Input>),
): Scalar<Type, Input, Value> =>
  typeof scalar === 'function' ? { encode: scalar } : scalar;
