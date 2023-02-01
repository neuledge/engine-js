/**
 * The defintion of a data type.
 * This is used to determine how the value is encoded and decoded to and
 * from the database.
 */
export interface StoreShape<Type extends StoreShapeType = StoreShapeType> {
  /**
   * The type of the shape.
   * This is used to determine how the value is encoded and decoded to and
   * from the database.
   */
  type: Type;

  /**
   * The size of the shape value in bytes.
   * This is used for strings, buffers and numbers. For example, a size of 255
   * means that the string or buffer can have a maximum of 255 bytes. For
   * numbers, a size of 4 means that the number represents a 32-bit number.
   * If omitted, the size is unlimited.
   */
  size?: number | null;

  /**
   * The signedness of the shape value for numbers.
   * This is used for numbers. If `true`, the number is unsigned. If `false`,
   * the number is signed (default). This property is ignored for strings and
   * buffers.
   */
  unsigned?: boolean | null;

  /**
   * The precision of the shape value for decimal numbers.
   * Precision is the number of digits in a number. For example, the
   * number 123.45 has a precision of 5. If omitted, the precision is unlimited.
   */
  precision?: number | null;

  /**
   * The scale of the shape value for decimal numbers.
   * Scale is the number of digits to the right of the decimal point in a
   * number. For example, the number 123.45 has a scale of 2. For integers, the
   * scale is 0. If the scale is greater than the precision, the scale is set
   * to the precision. If omitted, the scale is unlimited (withing the precision
   * limit).
   */
  scale?: number | null;

  /**
   * The list of possible values for the shape.
   * This is required for enum values and ignored for all other values.
   */
  values?: string[] | null;
}

/**
 * The encoding type of a value.
 * This is used to determine how the value is encoded and decoded to and from
 * the database.
 *
 * @see Store
 */
export type StoreShapeType = keyof StoreShapeTypeMap;

/**
 * The possible TypeScript types of a given shape type.
 *
 * @see Store
 * @see StoreShapeType
 */
export type TypeofStoreShapeType<T extends StoreShapeType> =
  StoreShapeTypeMap[T];

/**
 * The shape type of a given value.
 * This is used to infer the shape type of a value.
 *
 * @see Store
 * @see StoreShapeType
 */
export type StoreValueShapeType<Value> = Value extends string
  ? 'string' | 'enum'
  : Value extends number | bigint
  ? 'number'
  : Value extends boolean
  ? 'boolean'
  : Value extends Uint8Array
  ? 'binary'
  : Value extends Date
  ? 'date-time'
  : 'json';

interface StoreShapeTypeMap {
  /**
   * The string encoding is used for all string values.
   */
  string: string;

  /**
   * The number encoding is used for all number values.
   * This includes integers and floating point numbers. Use the encoding `size`,
   * `unsigned`, `precision` and `scale` properties to limit the size and the
   * values of the number. For example, 32-bit integers can be represented with
   * a size of 4 and a scale of 0.
   */
  number: number;

  /**
   * The boolean encoding is used for boolean values.
   */
  boolean: boolean;

  /**
   * The binary encoding is used for binary data.
   */
  binary: Uint8Array;

  /**
   * The enum encoding is used for a fixed list of enum values.
   */
  enum: string;

  /**
   * The date-time encoding is used for date and time values.
   */
  'date-time': Date;

  /**
   * The json encoding is used for any JSON value.
   */
  json: unknown;
}
