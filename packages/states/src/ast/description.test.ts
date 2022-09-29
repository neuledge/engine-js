import { TokensParser } from '@/tokens/parser.js';
import { DescriptionNode, parseMaybeDescriptionNode } from './description.js';

describe('ast/description', () => {
  describe('parseMaybeDescriptionNode()', () => {
    it('should parse regular string', () => {
      const cursor = new TokensParser(`"Hello World!" test me`);

      expect(parseMaybeDescriptionNode(cursor)).toEqual<DescriptionNode>({
        type: 'Description',
        start: 0,
        end: 14,
        value: 'Hello World!',
      });
      expect(cursor.index).toBe(1);
    });

    it('should parse literal string', () => {
      const cursor = new TokensParser(
        `
      """
      Hello 
      World!
      """
      test me`,
      );

      expect(parseMaybeDescriptionNode(cursor)).toEqual<DescriptionNode>({
        type: 'Description',
        start: 7,
        end: 46,
        value: 'Hello\nWorld!',
      });
      expect(cursor.index).toBe(1);
    });

    it('should ignore non-string tokens', () => {
      const cursor = new TokensParser(`test "Hello World!"`);

      expect(parseMaybeDescriptionNode(cursor)).toBe(undefined);
      expect(cursor.index).toBe(0);
    });
  });
});
