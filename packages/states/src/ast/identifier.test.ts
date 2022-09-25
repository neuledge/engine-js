import { TokensParser } from '@/tokens/parser.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';

describe('ast/identifier', () => {
  describe('parseIdentifierNode()', () => {
    it('should parse word token', () => {
      const cursor = new TokensParser(null, `foo`);

      expect(parseIdentifierNode(cursor)).toEqual<IdentifierNode>({
        type: 'Identifier',
        name: 'foo',
      });
      expect(cursor.current).toBe(undefined);
    });

    it('should throw on number token', () => {
      const cursor = new TokensParser(null, `123`);

      expect(() => parseIdentifierNode(cursor)).toThrow(
        'Expect identifier name (line: 1, column: 1)',
      );
      expect(cursor.position).toBe(0);
    });

    it('should throw on punctuation token', () => {
      const cursor = new TokensParser(null, ` ? foo`);

      expect(() => parseIdentifierNode(cursor)).toThrow(
        'Expect identifier name (line: 1, column: 2)',
      );
      expect(cursor.position).toBe(0);
    });
  });
});
