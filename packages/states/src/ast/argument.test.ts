import { TokensParser } from '@/tokens/parser.js';
import { ArgumentNode, parseMaybeArgumentNodes } from './argument.js';

/* eslint-disable max-lines-per-function */

describe('ast/argument', () => {
  describe('parseMaybeArgumentNodes()', () => {
    it('should skip parse if not brackets', () => {
      const cursor = new TokensParser(null, ` = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual([]);
      expect(cursor.position).toBe(0);
    });

    it('should accept empty brackets', () => {
      const cursor = new TokensParser(null, `() = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual([]);
      expect(cursor.position).toBe(2);
    });

    it('should accept single argument', () => {
      const cursor = new TokensParser(null, `(foo: 'bar') = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          key: { type: 'Identifier', name: 'foo' },
          value: { type: 'Literal', value: 'bar' },
        },
      ]);
      expect(cursor.position).toBe(5);
    });

    it('should fail with single argument and missing value', () => {
      const cursor = new TokensParser(null, `(foo: ,) = 3`);

      expect(() => parseMaybeArgumentNodes(cursor)).toThrow(
        'Expect literal value (line: 1, column: 7)',
      );
      expect(cursor.position).toBe(0);
    });

    it('should fail with single argument and missing colon', () => {
      const cursor = new TokensParser(null, `(foo 5,) = 3`);

      expect(() => parseMaybeArgumentNodes(cursor)).toThrow(
        "Expect ':' token (line: 1, column: 6)",
      );
      expect(cursor.position).toBe(0);
    });

    it('should accept single argument with trailing comma', () => {
      const cursor = new TokensParser(null, `(foo: 'bar',) = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          key: { type: 'Identifier', name: 'foo' },
          value: { type: 'Literal', value: 'bar' },
        },
      ]);
      expect(cursor.position).toBe(6);
    });

    it('should fail with single argument and multiple trailing commas', () => {
      const cursor = new TokensParser(null, `(foo: 'bar',,) = 3`);

      expect(() => parseMaybeArgumentNodes(cursor)).toThrow(
        'Expect identifier name (line: 1, column: 13)',
      );
      expect(cursor.position).toBe(0);
    });

    it('should accept two arguments', () => {
      const cursor = new TokensParser(null, `(foo: 'bar', x: 3) = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          key: { type: 'Identifier', name: 'foo' },
          value: { type: 'Literal', value: 'bar' },
        },
        {
          type: 'Argument',
          key: { type: 'Identifier', name: 'x' },
          value: { type: 'Literal', value: 3 },
        },
      ]);
      expect(cursor.position).toBe(9);
    });

    it('should accept two arguments with trailing comma', () => {
      const cursor = new TokensParser(null, `(foo: 'bar', x: 3,) = 3`);

      expect(parseMaybeArgumentNodes(cursor)).toEqual<ArgumentNode[]>([
        {
          type: 'Argument',
          key: { type: 'Identifier', name: 'foo' },
          value: { type: 'Literal', value: 'bar' },
        },
        {
          type: 'Argument',
          key: { type: 'Identifier', name: 'x' },
          value: { type: 'Literal', value: 3 },
        },
      ]);
      expect(cursor.position).toBe(10);
    });
  });
});
