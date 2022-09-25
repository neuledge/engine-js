import { TokensParser } from '@/tokens/index.js';
import { LiteralNode, parseLiteralNode } from './literal.js';

/* eslint-disable max-lines-per-function */

describe('ast/literal', () => {
  describe('parseLiteralNode()', () => {
    it('should parse string', () => {
      const cursor = new TokensParser(null, `"bar" state bar {}`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: 'bar',
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse number', () => {
      const cursor = new TokensParser(null, `4, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: 4,
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse negative number', () => {
      const cursor = new TokensParser(null, `-78.31312, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: -78.313_12,
      });
      expect(cursor.position).toBe(2);
    });

    it('should parse negative NaN', () => {
      const cursor = new TokensParser(null, `-NaN, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: -NaN,
      });
      expect(cursor.position).toBe(2);
    });

    it('should parse Infinity', () => {
      const cursor = new TokensParser(null, `Infinity, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: Infinity,
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse Infinity', () => {
      const cursor = new TokensParser(null, `Infinity, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: Infinity,
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse true', () => {
      const cursor = new TokensParser(null, `true, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: true,
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse false', () => {
      const cursor = new TokensParser(null, `false, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: false,
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse null', () => {
      const cursor = new TokensParser(null, `null, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: null,
      });
      expect(cursor.position).toBe(1);
    });

    it('should throw on unknown words', () => {
      const cursor = new TokensParser(null, `state, bar: 7)`);

      expect(() => parseLiteralNode(cursor)).toThrow(
        'Expect literal value (line: 1, column: 1)',
      );
      expect(cursor.position).toBe(0);
    });

    it('should parse empty array', () => {
      const cursor = new TokensParser(null, `[], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: [],
      });
      expect(cursor.position).toBe(2);
    });

    it('should parse one item array', () => {
      const cursor = new TokensParser(null, `[1], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: [1],
      });
      expect(cursor.position).toBe(3);
    });

    it('should parse one item array with trailing comma', () => {
      const cursor = new TokensParser(null, `[1,], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: [1],
      });
      expect(cursor.position).toBe(4);
    });

    it('should parse two items array', () => {
      const cursor = new TokensParser(null, `[1,2], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: [1, 2],
      });
      expect(cursor.position).toBe(5);
    });

    it('should parse two items array with trailing comma', () => {
      const cursor = new TokensParser(null, `[1,2,], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: [1, 2],
      });
      expect(cursor.position).toBe(6);
    });

    it('should parse array within array', () => {
      const cursor = new TokensParser(null, `[1, ['foo', 2]], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        value: [1, ['foo', 2]],
      });
      expect(cursor.position).toBe(9);
    });
  });
});
