import { TokensParser } from '@/tokens/parser.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';

describe('ast/identifier', () => {
  describe('parseIdentifierNode()', () => {
    it('should parse word token', () => {
      const cursor = new TokensParser(`foo`);

      expect(parseIdentifierNode(cursor)).toEqual<IdentifierNode>({
        type: 'Identifier',
        start: 0,
        end: 3,
        name: 'foo',
      });
      expect(cursor.current).toBe(undefined);
    });

    it('should throw on number token', () => {
      const cursor = new TokensParser(`123`);

      expect(() => parseIdentifierNode(cursor)).toThrow(
        'Expect identifier name',
      );
      expect(cursor.index).toBe(0);
    });

    it('should throw on punctuation token', () => {
      const cursor = new TokensParser(` ? foo`);

      expect(() => parseIdentifierNode(cursor)).toThrow(
        'Expect identifier name',
      );
      expect(cursor.index).toBe(0);
    });
  });
});
