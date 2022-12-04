import { Tokenizer } from '@/tokenizer';
import { ImportNode, parseImportNodes } from './import';

/* eslint-disable max-lines-per-function */

describe('ast/import', () => {
  describe('parseImportNodes()', () => {
    it('should ignore other keywords', () => {
      const cursor = new Tokenizer(`foo`);

      expect(parseImportNodes(cursor)).toEqual<ImportNode[]>([]);
      expect(cursor.index).toBe(0);
    });

    it('should parse import', () => {
      const cursor = new Tokenizer(`import "foo" test`);

      expect(parseImportNodes(cursor)).toEqual<ImportNode[]>([
        {
          type: 'Import',
          path: undefined,
          start: 0,
          end: 12,
          source: {
            type: 'Literal',
            value: 'foo',
            path: undefined,
            start: 7,
            end: 12,
          },
        },
      ]);
      expect(cursor.index).toBe(2);
    });

    it('should throw on missing path', () => {
      const cursor = new Tokenizer(`import import`);

      expect(() => parseImportNodes(cursor)).toThrow('Expect import path');
      expect(cursor.index).toBe(0);
    });

    it('should parse multiple imports', () => {
      const cursor = new Tokenizer(
        `
      import "foo" 
      import "bar" 
      test`,
      );

      expect(parseImportNodes(cursor)).toEqual<ImportNode[]>([
        {
          type: 'Import',
          source: {
            type: 'Literal',
            value: 'foo',
            path: undefined,
            start: 14,
            end: 19,
          },
          path: undefined,
          start: 7,
          end: 19,
        },
        {
          type: 'Import',
          source: {
            type: 'Literal',
            value: 'bar',
            path: undefined,
            start: 34,
            end: 39,
          },
          path: undefined,
          start: 27,
          end: 39,
        },
      ]);
      expect(cursor.index).toBe(4);
    });
  });
});
