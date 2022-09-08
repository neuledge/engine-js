export type Scalar<
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
  Value = Type,
> =
  | ClassScalar<Type, Input, Value>
  | (FuncScalar<Type, Input> & FuncScalar<Value, Input>);

export interface ClassScalar<
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
  Value = Type,
> {
  encode: (value: Input) => Value | PromiseLike<Value>;
  decode?: (value: Value) => Type | PromiseLike<Type>;
}

export type FuncScalar<
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
> = (value: Input) => Type;

export type ScalarType<S extends Scalar> = S extends ClassScalar<
  infer T,
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>
  ? T
  : S extends FuncScalar<infer T, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ? T
  : never;

export type ScalarInput<S extends Scalar> = S extends ClassScalar<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  infer T,
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>
  ? T
  : S extends FuncScalar<
      any, // eslint-disable-line @typescript-eslint/no-explicit-any
      infer T
    >
  ? T
  : never;

export type ScalarValue<S extends Scalar> = S extends ClassScalar<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  infer T
>
  ? T
  : S extends FuncScalar<infer T, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ? T
  : never;

export const createScalar = <Type, Input, Value>(
  scalar: Scalar<Type, Input, Value>,
): ClassScalar<Type, Input, Value> =>
  typeof scalar === 'function' ? { encode: scalar } : scalar;
