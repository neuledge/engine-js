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
      state Foo@2 {
        bar: Int = 4
      }`,
      );

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        start: 7,
        end: 49,
        imports: [],
        body: [
          {
            type: 'State',
            start: 7,
            end: 49,
            id: {
              type: 'Versionate',
              start: 13,
              end: 18,
              identifier: {
                type: 'Identifier',
                start: 13,
                end: 16,
                name: 'Foo',
              },
              version: {
                type: 'Literal',
                start: 17,
                end: 18,
                value: 2,
              },
            },
            decorators: [],
            description: undefined,
            from: undefined,
            fields: [
              {
                type: 'Field',
                start: 29,
                end: 41,
                key: {
                  type: 'Identifier',
                  start: 29,
                  end: 32,
                  name: 'bar',
                },
                decorators: [],
                description: undefined,
                fieldType: {
                  type: 'TypeExpression',
                  start: 34,
                  end: 37,
                  identifier: {
                    type: 'Identifier',
                    start: 34,
                    end: 37,
                    name: 'Int',
                  },
                  list: false,
                },
                index: { type: 'Literal', start: 40, end: 41, value: 4 },
                nullable: false,
              },
            ],
          },
        ],
      });
      expect(cursor.index).toBe(11);
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

      state Foo@1 {
        bar: Int = 4
      }`,
      );

      expect(parseRootNode(cursor)).toEqual<RootNode>({
        type: 'Root',
        start: 7,
        end: 69,
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
            end: 69,
            id: {
              type: 'Versionate',
              start: 33,
              end: 38,
              identifier: {
                type: 'Identifier',
                start: 33,
                end: 36,
                name: 'Foo',
              },
              version: {
                type: 'Literal',
                start: 37,
                end: 38,
                value: 1,
              },
            },
            decorators: [],
            description: undefined,
            from: undefined,
            fields: [
              {
                type: 'Field',
                start: 49,
                end: 61,
                key: {
                  type: 'Identifier',
                  start: 49,
                  end: 52,
                  name: 'bar',
                },
                decorators: [],
                description: undefined,
                fieldType: {
                  type: 'TypeExpression',
                  start: 54,
                  end: 57,
                  identifier: {
                    type: 'Identifier',
                    start: 54,
                    end: 57,
                    name: 'Int',
                  },
                  list: false,
                },
                index: { type: 'Literal', start: 60, end: 61, value: 4 },
                nullable: false,
              },
            ],
          },
        ],
      });
      expect(cursor.index).toBe(13);
    });
  });
});
