import { TokensParser } from '@/tokens/parser.js';
import { DescriptionNode, parseMaybeDescriptionNode } from './description.js';

describe('ast/description', () => {
  describe('parseMaybeDescriptionNode()', () => {
    it('should parse regular string', () => {
      const cursor = new TokensParser(null, `"Hello World!" test me`);

      expect(parseMaybeDescriptionNode(cursor)).toEqual<DescriptionNode>({
        type: 'Description',
        value: 'Hello World!',
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse literal string', () => {
      const cursor = new TokensParser(
        null,
        `
      """
      Hello 
      World!
      """
      test me`,
      );

      expect(parseMaybeDescriptionNode(cursor)).toEqual<DescriptionNode>({
        type: 'Description',
        value: 'Hello\nWorld!',
      });
      expect(cursor.position).toBe(1);
    });

    it('should ignore non-string tokens', () => {
      const cursor = new TokensParser(null, `test "Hello World!"`);

      expect(parseMaybeDescriptionNode(cursor)).toBe(undefined);
      expect(cursor.position).toBe(0);
    });
  });
});
