import { TokenCursor } from '@/tokens';
import { IdentifierNode, parseIdentifierNode } from './identifier';

describe('nodes/identifier', () => {
  describe('parseIdentifierNode()', () => {
    it('should parse word token', () => {
      const cursor = new TokenCursor(`foo`);

      expect(parseIdentifierNode(cursor)).toEqual<IdentifierNode>({
        type: 'Identifier',
        start: 0,
        end: 3,
        name: 'foo',
      });
      expect(cursor.current).toBeUndefined();
    });

    it('should throw on number token', () => {
      const cursor = new TokenCursor(`123`);

      expect(() => parseIdentifierNode(cursor)).toThrow(
        'Expect identifier name',
      );
      expect(cursor.index).toBe(0);
    });

    it('should throw on punctuation token', () => {
      const cursor = new TokenCursor(` ? foo`);

      expect(() => parseIdentifierNode(cursor)).toThrow(
        'Expect identifier name',
      );
      expect(cursor.index).toBe(0);
    });
  });
});
