import { TokensParser } from '@/tokens/index.js';
import { LiteralNode, parseLiteralNode } from './literal.js';

/* eslint-disable max-lines-per-function */

describe('ast/literal', () => {
  describe('parseLiteralNode()', () => {
    it('should parse string', () => {
      const cursor = new TokensParser(`"bar" state bar {}`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 5,
        value: 'bar',
      });
      expect(cursor.index).toBe(1);
    });

    it('should parse number', () => {
      const cursor = new TokensParser(`4, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 1,
        value: 4,
      });
      expect(cursor.index).toBe(1);
    });

    it('should parse negative number', () => {
      const cursor = new TokensParser(`-78.31312, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 9,
        value: -78.313_12,
      });
      expect(cursor.index).toBe(2);
    });

    it('should parse negative NaN', () => {
      const cursor = new TokensParser(`-NaN, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 4,
        value: -NaN,
      });
      expect(cursor.index).toBe(2);
    });

    it('should parse Infinity', () => {
      const cursor = new TokensParser(`Infinity, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 8,
        value: Infinity,
      });
      expect(cursor.index).toBe(1);
    });

    it('should parse true', () => {
      const cursor = new TokensParser(`true, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 4,
        value: true,
      });
      expect(cursor.index).toBe(1);
    });

    it('should parse false', () => {
      const cursor = new TokensParser(`false, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 5,
        value: false,
      });
      expect(cursor.index).toBe(1);
    });

    it('should parse null', () => {
      const cursor = new TokensParser(`null, bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 4,
        value: null,
      });
      expect(cursor.index).toBe(1);
    });

    it('should throw on unknown words', () => {
      const cursor = new TokensParser(`state, bar: 7)`);

      expect(() => parseLiteralNode(cursor)).toThrow('Expect literal value');
      expect(cursor.index).toBe(0);
    });

    it('should parse empty array', () => {
      const cursor = new TokensParser(`[], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 2,
        value: [],
      });
      expect(cursor.index).toBe(2);
    });

    it('should parse one item array', () => {
      const cursor = new TokensParser(`[1], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 3,
        value: [1],
      });
      expect(cursor.index).toBe(3);
    });

    it('should parse one item array with trailing comma', () => {
      const cursor = new TokensParser(`[1,], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 4,
        value: [1],
      });
      expect(cursor.index).toBe(4);
    });

    it('should parse two items array', () => {
      const cursor = new TokensParser(`[1,2], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 5,
        value: [1, 2],
      });
      expect(cursor.index).toBe(5);
    });

    it('should parse two items array with trailing comma', () => {
      const cursor = new TokensParser(`[1,2,], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 6,
        value: [1, 2],
      });
      expect(cursor.index).toBe(6);
    });

    it('should parse array within array', () => {
      const cursor = new TokensParser(`[1, ['foo', 2]], bar: 7)`);

      expect(parseLiteralNode(cursor)).toEqual<LiteralNode>({
        type: 'Literal',
        start: 0,
        end: 15,
        value: [1, ['foo', 2]],
      });
      expect(cursor.index).toBe(9);
    });
  });
});
