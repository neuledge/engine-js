import { TokensParser } from '@/tokens/parser.js';
import { ImportNode, parseImportNodes } from './import.js';

/* eslint-disable max-lines-per-function */

describe('ast/import', () => {
  describe('parseImportNodes()', () => {
    it('should ignore other keywords', () => {
      const cursor = new TokensParser(`foo`);

      expect(parseImportNodes(cursor)).toEqual<ImportNode[]>([]);
      expect(cursor.index).toBe(0);
    });

    it('should parse import', () => {
      const cursor = new TokensParser(`import "foo" test`);

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
      const cursor = new TokensParser(`import import`);

      expect(() => parseImportNodes(cursor)).toThrow('Expect import path');
      expect(cursor.index).toBe(0);
    });

    it('should parse multiple imports', () => {
      const cursor = new TokensParser(
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
