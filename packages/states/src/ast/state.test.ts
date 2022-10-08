import { TokensParser } from '../tokens/index.js';
import { parseStateNode, StateNode } from './state.js';

/* eslint-disable max-lines-per-function */

describe('ast/state', () => {
  describe('parseStateNode()', () => {
    it('should throw on state with missing version', () => {
      const cursor = new TokensParser(
        `state FreeAccount {
          plan: FreePlan = 1 
        }`,
      );

      expect(() => parseStateNode(cursor)).toThrow("Expect '@' token");
    });

    it('should throw on state with version 0', () => {
      const cursor = new TokensParser(
        `state FreeAccount@0 {
          plan: FreePlan = 1 
        }`,
      );

      expect(() => parseStateNode(cursor)).toThrow('Expect positive integer');
    });

    it('should parse example state', () => {
      const cursor = new TokensParser(
        `
@index(type: "full-text", fields: ["name"])
state FreeAccount@1 {
    @id id: PositiveInteger = 1 
    name: TrimmedString(limit: 100) = 2 
    plan: FreePlan = 3 
    users: User[] = 4 
}
`,
      );

      expect(parseStateNode(cursor)).toEqual<StateNode>({
        type: 'State',
        start: 45,
        end: 189,
        from: undefined,
        description: undefined,
        id: {
          type: 'Versionate',
          start: 51,
          end: 64,
          identifier: {
            type: 'Identifier',
            name: 'FreeAccount',
            start: 51,
            end: 62,
          },
          version: {
            type: 'Literal',
            start: 63,
            end: 64,
            value: 1,
          },
        },
        fields: [
          {
            type: 'Field',
            start: 75,
            end: 98,
            key: { type: 'Identifier', start: 75, end: 77, name: 'id' },
            decorators: [
              {
                type: 'Decorator',
                start: 71,
                end: 74,
                callee: { type: 'Identifier', name: 'id', start: 72, end: 74 },
                arguments: [],
              },
            ],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              start: 79,
              end: 94,
              identifier: {
                name: 'PositiveInteger',
                type: 'Identifier',
                start: 79,
                end: 94,
              },
              list: false,
            },
            nullable: false,
            index: { type: 'Literal', start: 97, end: 98, value: 1 },
          },
          {
            type: 'Field',
            start: 104,
            end: 139,
            key: {
              type: 'Identifier',
              start: 104,
              end: 108,
              name: 'name',
            },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeGenerator',
              start: 110,
              end: 135,
              identifier: {
                type: 'Identifier',
                start: 110,
                end: 123,
                name: 'TrimmedString',
              },
              arguments: [
                {
                  type: 'Argument',
                  start: 124,
                  end: 134,
                  key: {
                    type: 'Identifier',
                    start: 124,
                    end: 129,
                    name: 'limit',
                  },
                  value: { type: 'Literal', start: 131, end: 134, value: 100 },
                },
              ],
            },
            nullable: false,
            index: { type: 'Literal', start: 138, end: 139, value: 2 },
          },
          {
            type: 'Field',
            start: 145,
            end: 163,
            key: {
              type: 'Identifier',
              start: 145,
              end: 149,
              name: 'plan',
            },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              start: 151,
              end: 159,
              identifier: {
                type: 'Identifier',
                start: 151,
                end: 159,
                name: 'FreePlan',
              },
              list: false,
            },
            nullable: false,
            index: { type: 'Literal', start: 162, end: 163, value: 3 },
          },
          {
            type: 'Field',
            start: 169,
            end: 186,
            key: {
              type: 'Identifier',
              start: 169,
              end: 174,
              name: 'users',
            },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              start: 176,
              end: 182,
              identifier: {
                type: 'Identifier',
                start: 176,
                end: 180,
                name: 'User',
              },
              list: true,
            },
            nullable: false,
            index: { type: 'Literal', start: 185, end: 186, value: 4 },
          },
        ],
        decorators: [
          {
            type: 'Decorator',
            start: 1,
            end: 44,
            callee: { type: 'Identifier', start: 2, end: 7, name: 'index' },
            arguments: [
              {
                type: 'Argument',
                start: 8,
                end: 25,
                key: { type: 'Identifier', start: 8, end: 12, name: 'type' },
                value: {
                  type: 'Literal',
                  start: 14,
                  end: 25,
                  value: 'full-text',
                },
              },
              {
                type: 'Argument',
                start: 27,
                end: 43,
                key: { type: 'Identifier', name: 'fields', start: 27, end: 33 },
                value: { type: 'Literal', value: ['name'], start: 35, end: 43 },
              },
            ],
          },
        ],
      });
    });

    it('should parse extended state', () => {
      const cursor = new TokensParser(
        `state FreeAccount@1 from BasicAccount {
          plan: FreePlan = 1 
        }`,
      );

      expect(parseStateNode(cursor)).toEqual<StateNode>({
        type: 'State',
        start: 0,
        end: 79,
        decorators: [],
        description: undefined,
        id: {
          type: 'Versionate',
          start: 6,
          end: 19,
          identifier: {
            type: 'Identifier',
            start: 6,
            end: 17,
            name: 'FreeAccount',
          },
          version: {
            type: 'Literal',
            start: 18,
            end: 19,
            value: 1,
          },
        },
        from: {
          type: 'Versionate',
          start: 25,
          end: 37,
          identifier: {
            type: 'Identifier',
            start: 25,
            end: 37,
            name: 'BasicAccount',
          },
          version: undefined,
        },
        fields: [
          {
            type: 'Field',
            start: 50,
            end: 68,
            description: undefined,
            decorators: [],
            key: {
              type: 'Identifier',
              start: 50,
              end: 54,
              name: 'plan',
            },
            fieldType: {
              type: 'TypeExpression',
              start: 56,
              end: 64,
              identifier: {
                type: 'Identifier',
                start: 56,
                end: 64,
                name: 'FreePlan',
              },
              list: false,
            },
            index: { type: 'Literal', start: 67, end: 68, value: 1 },
            nullable: false,
          },
        ],
      });
    });

    it('should parse state with versonate extends', () => {
      const cursor = new TokensParser(
        `state FreeAccount@2 from BasicAccount@1 {
          plan: FreePlan = 1 
        }`,
      );

      expect(parseStateNode(cursor)).toEqual<StateNode>({
        type: 'State',
        start: 0,
        end: 81,
        decorators: [],
        description: undefined,
        id: {
          type: 'Versionate',
          start: 6,
          end: 19,
          identifier: {
            type: 'Identifier',
            start: 6,
            end: 17,
            name: 'FreeAccount',
          },
          version: { type: 'Literal', start: 18, end: 19, value: 2 },
        },
        from: {
          type: 'Versionate',
          start: 25,
          end: 39,
          identifier: {
            type: 'Identifier',
            start: 25,
            end: 37,
            name: 'BasicAccount',
          },
          version: { type: 'Literal', start: 38, end: 39, value: 1 },
        },
        fields: [
          {
            type: 'Field',
            start: 52,
            end: 70,
            decorators: [],
            description: undefined,
            key: { end: 56, name: 'plan', start: 52, type: 'Identifier' },
            fieldType: {
              type: 'TypeExpression',
              end: 66,
              identifier: {
                type: 'Identifier',
                start: 58,
                end: 66,
                name: 'FreePlan',
              },
              list: false,
              start: 58,
            },
            index: { type: 'Literal', start: 69, end: 70, value: 1 },
            nullable: false,
          },
        ],
      });
    });
  });
});
