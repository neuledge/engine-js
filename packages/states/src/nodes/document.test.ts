import { Tokenizer } from '@/tokenizer';
import { parseDocumentNode, DocumentNode } from './document';

/* eslint-disable max-lines-per-function */

describe('ast/document', () => {
  describe('parseDocumentNode()', () => {
    it('should parse empty file', () => {
      const cursor = new Tokenizer(``);

      expect(parseDocumentNode(cursor)).toEqual<DocumentNode>({
        type: 'Root',
        start: 0,
        end: 0,
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
        body: [{ type: 'State', id: { type: 'Identifier', name: 'Foo' } }],
      });
      expect(cursor.index).toBe(9);
    });

    it('should parse multiple states', () => {
      const cursor = new Tokenizer(
        `
      state Foo {
        foo: Int = 1
      }

      state Bar {
        bar: Int = 1
      }`,
      );

      expect(parseDocumentNode(cursor)).toMatchObject({
        type: 'Root',
        start: 7,
        end: 95,
        body: [
          { type: 'State', id: { type: 'Identifier', name: 'Foo' } },
          { type: 'State', id: { type: 'Identifier', name: 'Bar' } },
        ],
      });
      expect(cursor.index).toBe(18);
    });
  });
});
