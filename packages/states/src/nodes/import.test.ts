import { Tokenizer } from '@/tokenizer.js';
import { ImportNode, parseImportNodes } from './import.js';

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
          start: 0,
          end: 12,
          path: 'foo',
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
          path: 'foo',
          start: 7,
          end: 19,
        },
        {
          type: 'Import',
          path: 'bar',
          start: 27,
          end: 39,
        },
      ]);
      expect(cursor.index).toBe(4);
    });
  });
});
