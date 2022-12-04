import { Tokenizer } from '@/tokenizer';
import { DecoratorNode, parseDecoratorNodes } from './decorator';

/* eslint-disable max-lines-per-function */

describe('ast/decorator', () => {
  describe('parseDecoratorNodes()', () => {
    it('should skip parse if no "@" found', () => {
      const cursor = new Tokenizer(`state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual([]);
      expect(cursor.index).toBe(0);
    });

    it('should fail if missing name', () => {
      const cursor = new Tokenizer(`@ state bar {}`);

      expect(() => parseDecoratorNodes(cursor)).toThrow(
        'Expect decorator name',
      );
      expect(cursor.index).toBe(0);
    });

    it('should get state decorator', () => {
      const cursor = new Tokenizer(`@index state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual<DecoratorNode[]>([
        {
          type: 'Decorator',
          start: 0,
          end: 6,
          callee: { type: 'Identifier', name: 'index', start: 1, end: 6 },
          arguments: [],
        },
      ]);
      expect(cursor.index).toBe(2);
    });

    it('should get state decorator with empty arguments', () => {
      const cursor = new Tokenizer(`@index() state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual<DecoratorNode[]>([
        {
          type: 'Decorator',
          start: 0,
          end: 8,
          callee: { type: 'Identifier', name: 'index', start: 1, end: 6 },
          arguments: [],
        },
      ]);
      expect(cursor.index).toBe(4);
    });

    it('should get state decorator with arguments', () => {
      const cursor = new Tokenizer(`@index(foo: 'bar') state bar {}`);

      expect(parseDecoratorNodes(cursor)).toEqual<DecoratorNode[]>([
        {
          type: 'Decorator',
          start: 0,
          end: 18,
          callee: { type: 'Identifier', name: 'index', start: 1, end: 6 },
          arguments: [
            {
              type: 'Argument',
              start: 7,
              end: 17,
              key: { type: 'Identifier', name: 'foo', start: 7, end: 10 },
              value: { type: 'Literal', value: 'bar', start: 12, end: 17 },
            },
          ],
        },
      ]);
      expect(cursor.index).toBe(7);
    });
  });
});
