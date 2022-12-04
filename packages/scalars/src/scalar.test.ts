import {
  createScalar,
  Scalar,
  ScalarFunction,
  ScalarInput,
  ScalarType,
  ScalarValue,
} from './scalar';

/* eslint-disable max-lines-per-function */

describe('Scalar', () => {
  describe('createScalar()', () => {
    it('should create from object', () => {
      const scalar = createScalar({
        key: 'test',
        encode: (value: string | number) => Buffer.from(String(value)),
        decode: (buffer) => buffer.toString(),
      });

      expect<Scalar<string, string | number, Buffer>>(scalar);
    });

    it('should create from function', () => {
      const scalar = createScalar(String);

      expect<Scalar<string, unknown, string>>(scalar);

      expect(scalar.encode(123)).toBe('123');
      expect(scalar.decode).toBeUndefined();
      expect(scalar.key).toBe('String');
    });
  });

  describe('ScalarFunc<>', () => {
    it('should match scalar function', () => {
      expect<ScalarFunction<string>>(String);
      expect<ScalarFunction<string, unknown>>(String);
    });
  });

  describe('Scalar<>', () => {
    it('should match scalar oject', () => {
      expect<Scalar<string>>({
        key: 'test',
        encode: (value: string) => value,
        decode: (value: string) => value,
      });

      expect<Scalar<string, unknown>>({
        key: 'test',
        encode: String,
        decode: (value: string) => value,
      });

      expect<Scalar<string, unknown, number>>({
        key: 'test',
        encode: Number,
        decode: String,
      });
    });

    it('should omit method types', () => {
      const scalar: Scalar<string, unknown, number> = {
        key: 'test',
        encode: Number,
        decode: String,
      };

      expect(scalar);
    });
  });

  describe('ScalarType<>', () => {
    it('should match scalar type', () => {
      expect<ScalarType<Scalar<string>>>('foo');
      expect<ScalarType<Scalar<boolean, number>>>(true);
      expect<ScalarType<Scalar<number, string, boolean>>>(123);
    });
  });

  describe('ScalarInput<>', () => {
    it('should match scalar input', () => {
      expect<ScalarInput<Scalar<string>>>('foo');
      expect<ScalarInput<Scalar<boolean, number>>>(123);
      expect<ScalarInput<Scalar<number, string, boolean>>>('foo');
    });
  });

  describe('ScalarValue<>', () => {
    it('should match scalar value', () => {
      expect<ScalarValue<Scalar<string>>>('foo');
      expect<ScalarValue<Scalar<boolean, number>>>(true);
      expect<ScalarValue<Scalar<number, string, boolean>>>(true);
    });
  });
});
