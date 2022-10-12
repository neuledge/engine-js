import { Tokenizer } from '@/tokenizer.js';
import { parseDocumentNode, DocumentNode } from './document.js';

/* eslint-disable max-lines-per-function */

describe('ast/document', () => {
  describe('parseDocumentNode()', () => {
    it('should parse empty file', () => {
      const cursor = new Tokenizer(``);

      expect(parseDocumentNode(cursor)).toEqual<DocumentNode>({
        type: 'Root',
        start: 0,
        end: 0,
        imports: [],
        body: [],
      });
      expect(cursor.index).toBe(0);
    });

    it('should parse single state', () => {
      const cursor = new Tokenizer(
        `
      state Foo {
        bar: Int = 4
      }`,
      );

      expect(parseDocumentNode(cursor)).toMatchObject({
        type: 'Root',
        start: 7,
        end: 47,
        imports: [],
        body: [{ type: 'State', id: { type: 'Identifier', name: 'Foo' } }],
      });
      expect(cursor.index).toBe(9);
    });

    it('should import', () => {
      const cursor = new Tokenizer(`import "Bar"`);

      expect(parseDocumentNode(cursor)).toMatchObject({
        type: 'Root',
        start: 0,
        end: 12,
        imports: [{ type: 'Import', source: { value: 'Bar' } }],
        body: [],
      });
      expect(cursor.index).toBe(2);
    });

    it('should parse import and state', () => {
      const cursor = new Tokenizer(
        `
      import "Bar"

      state Foo {
        bar: Int = 4
      }`,
      );

      expect(parseDocumentNode(cursor)).toMatchObject({
        type: 'Root',
        start: 7,
        end: 67,
        imports: [{ type: 'Import', source: { value: 'Bar' } }],
        body: [{ type: 'State', id: { type: 'Identifier', name: 'Foo' } }],
      });
      expect(cursor.index).toBe(11);
    });
  });
});
