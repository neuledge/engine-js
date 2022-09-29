import { TokensParser } from '@/tokens/parser.js';
import { parseRootNode, RootNode } from './root.js';

/* eslint-disable max-lines-per-function */

describe('ast/root', () => {
  describe('parseRootNode()', () => {
    it('should parse empty file', () => {
      const cursor = new TokensParser(``);

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        start: 0,
        end: 0,
        imports: [],
        body: [],
      });
      expect(cursor.index).toBe(0);
    });

    it('should parse single state', () => {
      const cursor = new TokensParser(
        `
      state Foo {
        bar: Int = 4
      }`,
      );

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        start: 7,
        end: 47,
        imports: [],
        body: [
          {
            type: 'State',
            start: 7,
            end: 47,
            identifier: { type: 'Identifier', start: 13, end: 16, name: 'Foo' },
            decorators: [],
            description: undefined,
            extends: undefined,
            fields: [
              {
                type: 'Field',
                start: 27,
                end: 39,
                identifier: {
                  type: 'Identifier',
                  start: 27,
                  end: 30,
                  name: 'bar',
                },
                decorators: [],
                description: undefined,
                fieldType: {
                  type: 'TypeExpression',
                  start: 32,
                  end: 35,
                  identifier: {
                    type: 'Identifier',
                    start: 32,
                    end: 35,
                    name: 'Int',
                  },
                  list: false,
                },
                index: { type: 'Literal', start: 38, end: 39, value: 4 },
                nullable: false,
              },
            ],
          },
        ],
      });
      expect(cursor.index).toBe(9);
    });

    it('should import', () => {
      const cursor = new TokensParser(`import "Bar"`);

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        start: 0,
        end: 12,
        imports: [
          {
            type: 'Import',
            start: 0,
            end: 12,
            path: 'Bar',
          },
        ],
        body: [],
      });
      expect(cursor.index).toBe(2);
    });

    it('should parse import and state', () => {
      const cursor = new TokensParser(
        `
      import "Bar"

      state Foo {
        bar: Int = 4
      }`,
      );

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        start: 7,
        end: 67,
        imports: [
          {
            type: 'Import',
            start: 7,
            end: 19,
            path: 'Bar',
          },
        ],
        body: [
          {
            type: 'State',
            start: 27,
            end: 67,
            identifier: { type: 'Identifier', start: 33, end: 36, name: 'Foo' },
            decorators: [],
            description: undefined,
            extends: undefined,
            fields: [
              {
                type: 'Field',
                start: 47,
                end: 59,
                identifier: {
                  type: 'Identifier',
                  start: 47,
                  end: 50,
                  name: 'bar',
                },
                decorators: [],
                description: undefined,
                fieldType: {
                  type: 'TypeExpression',
                  start: 52,
                  end: 55,
                  identifier: {
                    type: 'Identifier',
                    start: 52,
                    end: 55,
                    name: 'Int',
                  },
                  list: false,
                },
                index: { type: 'Literal', start: 58, end: 59, value: 4 },
                nullable: false,
              },
            ],
          },
        ],
      });
      expect(cursor.index).toBe(11);
    });
  });
});
