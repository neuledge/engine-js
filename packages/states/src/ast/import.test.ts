import { TokensParser } from '@/tokens/parser.js';
import { ImportNode, parseImportNodes } from './import.js';

describe('ast/import', () => {
  describe('parseImportNodes()', () => {
    it('should ignore other keywords', () => {
      const cursor = new TokensParser(null, `foo`);

      expect(parseImportNodes(cursor)).toEqual<ImportNode[]>([]);
      expect(cursor.position).toBe(0);
    });

    it('should parse import', () => {
      const cursor = new TokensParser(null, `import "foo" test`);

      expect(parseImportNodes(cursor)).toEqual<ImportNode[]>([
        {
          type: 'Import',
          path: 'foo',
        },
      ]);
      expect(cursor.position).toBe(2);
    });

    it('should throw on missing path', () => {
      const cursor = new TokensParser(null, `import import`);

      expect(() => parseImportNodes(cursor)).toThrow(
        'Expect import path (line: 1, column: 8)',
      );
      expect(cursor.position).toBe(0);
    });

    it('should parse multiple imports', () => {
      const cursor = new TokensParser(
        null,
        `
      import "foo" 
      import "bar" 
      test`,
      );

      expect(parseImportNodes(cursor)).toEqual<ImportNode[]>([
        {
          type: 'Import',
          path: 'foo',
        },
        {
          type: 'Import',
          path: 'bar',
        },
      ]);
      expect(cursor.position).toBe(4);
    });
  });
});
