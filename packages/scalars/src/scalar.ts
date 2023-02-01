import { StoreShape, StoreValueShapeType } from '@neuledge/store';

export interface Scalar<
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
  Value = Type,
  ShapeType extends StoreValueShapeType<Value> = StoreValueShapeType<Value>,
> {
  /**
   * A type property to distinguish between different object.
   * Fixed to `Scalar`.
   */
  type: 'Scalar';

  /**
   * The name of the scalar value.
   * Scalar names usually start with a capital letter like `String` or
   * `Integer`.
   */
  name: string;

  /**
   * The description of the scalar value.
   * This is used to generate documentation for the scalar value and is
   * optional.
   */
  description?: string | null;

  /**
   * The deprecation reason of the scalar value in case it is deprecated.
   * If this is set to `true`, the scalar value is deprecated without a reason
   * (not recommended).
   * Otherwise, the scalar value is deprecated with the given reason so the user
   * knows why it is deprecated and what to use instead.
   */
  deprecated?: string | true | null;

  /**
   * The shape definition of the scalar value in the database.
   * The type of the shape is strictly defined by the value of the encoded
   * scalar.
   */
  shape: StoreShape<ShapeType>;

  /**
   * The encoding function of the scalar value.
   * This function is used to encode the scalar value to the database from a
   * given input value. This includes also the validation of the input value.
   */
  encode: (value: Input) => Value | PromiseLike<Value>;

  /**
   * The decoding function of the scalar value.
   * This function is used to decode the scalar value from the database. If
   * omitted, the value is returned as-is.
   */
  decode?: ((value: Value) => Type | PromiseLike<Type>) | null;
}

/**
 * Infers the type of a scalar.
 */
export type ScalarType<S extends Scalar> = S extends Scalar<
  infer T,
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>
  ? T
  : never;

/**
 * Infers the input type of a scalar.
 */
export type ScalarInput<S extends Scalar> = S extends Scalar<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  infer T,
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>
  ? T
  : never;

/**
 * Infers the value type of a scalar.
 */
export type ScalarValue<S extends Scalar> = S extends Scalar<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  infer T
>
  ? T
  : never;

/**
 * Infers the encoding type of a scalar.
 */
export type ScalarEncoding<S extends Scalar> = S extends Scalar<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  infer T
>
  ? T
  : never;
