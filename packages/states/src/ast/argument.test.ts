import { TokensParser } from '@/tokens/parser.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';

/* eslint-disable max-lines-per-function */

describe('ast/argument', () => {
  describe('parseMaybeArgumentNodes()', () => {
    it('should skip parse if not brackets', () => {
      const cursor = new TokensParser(` = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual([]);
      expect(cursor.index).toBe(0);
    });

    it('should accept empty brackets', () => {
      const cursor = new TokensParser(`() = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual([]);
      expect(cursor.index).toBe(2);
    });

    it('should accept single argument', () => {
      const cursor = new TokensParser(`(foo: 'bar') = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          start: 1,
          end: 11,
          key: { type: 'Identifier', name: 'foo', start: 1, end: 4 },
          value: { type: 'Literal', value: 'bar', start: 6, end: 11 },
        },
      ]);
      expect(cursor.index).toBe(5);
    });

    it('should fail with single argument and missing value', () => {
      const cursor = new TokensParser(`(foo: ,) = 3`);

      expect(() => parseMaybeArgumentNodes(cursor)).toThrow(
        'Expect literal value',
      );
      expect(cursor.index).toBe(0);
    });

    it('should fail with single argument and missing colon', () => {
      const cursor = new TokensParser(`(foo 5,) = 3`);

      expect(() => parseMaybeArgumentNodes(cursor)).toThrow("Expect ':' token");
      expect(cursor.index).toBe(0);
    });

    it('should accept single argument with trailing comma', () => {
      const cursor = new TokensParser(`(foo: 'bar',) = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          start: 1,
          end: 11,
          key: { type: 'Identifier', name: 'foo', start: 1, end: 4 },
          value: { type: 'Literal', value: 'bar', start: 6, end: 11 },
        },
      ]);
      expect(cursor.index).toBe(6);
    });

    it('should fail with single argument and multiple trailing commas', () => {
      const cursor = new TokensParser(`(foo: 'bar',,) = 3`);

      expect(() => parseMaybeArgumentNodes(cursor)).toThrow(
        'Expect identifier name',
      );
      expect(cursor.index).toBe(0);
    });

    it('should accept two arguments', () => {
      const cursor = new TokensParser(`(foo: 'bar', x: 3) = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          start: 1,
          end: 11,
          key: { type: 'Identifier', name: 'foo', start: 1, end: 4 },
          value: { type: 'Literal', value: 'bar', start: 6, end: 11 },
        },
        {
          type: 'Argument',
          start: 13,
          end: 17,
          key: { type: 'Identifier', name: 'x', start: 13, end: 14 },
          value: { type: 'Literal', value: 3, start: 16, end: 17 },
        },
      ]);
      expect(cursor.index).toBe(9);
    });

    it('should accept two arguments with trailing comma', () => {
      const cursor = new TokensParser(`(foo: 'bar', x: 3,) = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          start: 1,
          end: 11,
          key: { type: 'Identifier', name: 'foo', start: 1, end: 4 },
          value: { type: 'Literal', value: 'bar', start: 6, end: 11 },
        },
        {
          type: 'Argument',
          start: 13,
          end: 17,
          key: { type: 'Identifier', name: 'x', start: 13, end: 14 },
          value: { type: 'Literal', value: 3, start: 16, end: 17 },
        },
      ]);
      expect(cursor.index).toBe(10);
    });
  });
});
