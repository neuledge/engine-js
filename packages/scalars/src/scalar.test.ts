import { Scalar, ScalarInput, ScalarType, ScalarValue } from './scalar';

/* eslint-disable max-lines-per-function */

describe('Scalar', () => {
  describe('Scalar<>', () => {
    it('should match scalar oject', () => {
      expect<Scalar<string>>({
        type: 'Scalar',
        shape: { type: 'string' },
        name: 'test',
        encode: (value: string) => value,
        decode: (value: string) => value,
      });

      expect<Scalar<string, unknown>>({
        type: 'Scalar',
        shape: { type: 'string' },
        name: 'test',
        encode: String,
        decode: (value: string) => value,
      });

      expect<Scalar<string, unknown, number>>({
        type: 'Scalar',
        shape: { type: 'number' },
        name: 'test',
        encode: Number,
        decode: String,
      });
    });

    it('should omit method types', () => {
      const scalar: Scalar<string, unknown, number> = {
        type: 'Scalar',
        shape: { type: 'number' },
        name: 'test',
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
