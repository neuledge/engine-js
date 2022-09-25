import { TokensParser } from '@/tokens/parser.js';
import { parseRootNode, RootNode } from './root.js';

/* eslint-disable max-lines-per-function */

describe('ast/root', () => {
  describe('parseRootNode()', () => {
    it('should parse empty file', () => {
      const cursor = new TokensParser(null, ``);

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        imports: [],
        body: [],
      });
      expect(cursor.position).toBe(0);
    });

    it('should parse single state', () => {
      const cursor = new TokensParser(
        null,
        `
      state Foo {
        bar: Int = 4
      }`,
      );

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        imports: [],
        body: [
          {
            type: 'State',
            identifier: { name: 'Foo', type: 'Identifier' },
            decorators: [],
            description: undefined,
            extends: undefined,
            fields: [
              {
                type: 'Field',
                identifier: { name: 'bar', type: 'Identifier' },
                decorators: [],
                description: undefined,
                fieldType: {
                  identifier: { name: 'Int', type: 'Identifier' },
                  list: false,
                  type: 'TypeExpression',
                },
                index: 4,
                nullable: false,
              },
            ],
          },
        ],
      });
      expect(cursor.position).toBe(9);
    });

    it('should import', () => {
      const cursor = new TokensParser(null, `import "Bar"`);

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        imports: [
          {
            type: 'Import',
            path: 'Bar',
          },
        ],
        body: [],
      });
      expect(cursor.position).toBe(2);
    });

    it('should parse import and state', () => {
      const cursor = new TokensParser(
        null,
        `
      import "Bar"

      state Foo {
        bar: Int = 4
      }`,
      );

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        imports: [
          {
            type: 'Import',
            path: 'Bar',
          },
        ],
        body: [
          {
            type: 'State',
            identifier: { name: 'Foo', type: 'Identifier' },
            decorators: [],
            description: undefined,
            extends: undefined,
            fields: [
              {
                type: 'Field',
                identifier: { name: 'bar', type: 'Identifier' },
                decorators: [],
                description: undefined,
                fieldType: {
                  identifier: { name: 'Int', type: 'Identifier' },
                  list: false,
                  type: 'TypeExpression',
                },
                index: 4,
                nullable: false,
              },
            ],
          },
        ],
      });
      expect(cursor.position).toBe(11);
    });
  });
});
