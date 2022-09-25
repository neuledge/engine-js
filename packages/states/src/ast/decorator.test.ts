import { TokensParser } from '@/tokens/parser.js';
import { DecoratorNode, parseDecoratorNodes } from './decorator.js';

/* eslint-disable max-lines-per-function */

describe('ast/decorator', () => {
  describe('parseDecoratorNodes()', () => {
    it('should skip parse if no "@" found', () => {
      const cursor = new TokensParser(null, `state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual([]);
      expect(cursor.position).toBe(0);
    });

    it('should fail if missing name', () => {
      const cursor = new TokensParser(null, `@ state bar {}`);

      expect(() => parseDecoratorNodes(cursor)).toThrow(
        'Expect decorator name (line: 1, column: 1)',
      );
      expect(cursor.position).toBe(0);
    });

    it('should get state decorator', () => {
      const cursor = new TokensParser(null, `@index state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual<DecoratorNode[]>([
        {
          type: 'Decorator',
          callee: { type: 'Identifier', name: 'index' },
          arguments: [],
        },
      ]);
      expect(cursor.position).toBe(2);
    });

    it('should get state decorator with empty arguments', () => {
      const cursor = new TokensParser(null, `@index() state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual<DecoratorNode[]>([
        {
          type: 'Decorator',
          callee: { type: 'Identifier', name: 'index' },
          arguments: [],
        },
      ]);
      expect(cursor.position).toBe(4);
    });

    it('should get state decorator with arguments', () => {
      const cursor = new TokensParser(null, `@index(foo: 'bar') state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual<DecoratorNode[]>([
        {
          type: 'Decorator',
          callee: { type: 'Identifier', name: 'index' },
          arguments: [
            {
              type: 'Argument',
              key: { type: 'Identifier', name: 'foo' },
              value: { type: 'Literal', value: 'bar' },
            },
          ],
        },
      ]);
      expect(cursor.position).toBe(7);
    });
  });
});
