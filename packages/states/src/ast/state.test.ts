import { TokensParser } from '../tokens/index.js';
import { parseStateNode, StateNode } from './state.js';

/* eslint-disable max-lines-per-function */

describe('ast/state', () => {
  describe('parseStateNode()', () => {
    it('should parse example state', () => {
      const cursor = new TokensParser(
        `
@index(type: "full-text", fields: ["name"])
state FreeAccount {
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
        end: 187,
        extends: undefined,
        description: undefined,
        identifier: {
          type: 'Identifier',
          name: 'FreeAccount',
          start: 51,
          end: 62,
        },
        fields: [
          {
            type: 'Field',
            start: 73,
            end: 96,
            identifier: { type: 'Identifier', start: 73, end: 75, name: 'id' },
            decorators: [
              {
                type: 'Decorator',
                start: 69,
                end: 72,
                callee: { type: 'Identifier', name: 'id', start: 70, end: 72 },
                arguments: [],
              },
            ],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              start: 77,
              end: 92,
              identifier: {
                name: 'PositiveInteger',
                type: 'Identifier',
                start: 77,
                end: 92,
              },
              list: false,
            },
            nullable: false,
            index: { type: 'Literal', start: 95, end: 96, value: 1 },
          },
          {
            type: 'Field',
            start: 102,
            end: 137,
            identifier: {
              type: 'Identifier',
              start: 102,
              end: 106,
              name: 'name',
            },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeGenerator',
              start: 108,
              end: 133,
              identifier: {
                type: 'Identifier',
                start: 108,
                end: 121,
                name: 'TrimmedString',
              },
              arguments: [
                {
                  type: 'Argument',
                  start: 122,
                  end: 132,
                  key: {
                    type: 'Identifier',
                    start: 122,
                    end: 127,
                    name: 'limit',
                  },
                  value: { type: 'Literal', start: 129, end: 132, value: 100 },
                },
              ],
            },
            nullable: false,
            index: { type: 'Literal', start: 136, end: 137, value: 2 },
          },
          {
            type: 'Field',
            start: 143,
            end: 161,
            identifier: {
              type: 'Identifier',
              start: 143,
              end: 147,
              name: 'plan',
            },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              start: 149,
              end: 157,
              identifier: {
                type: 'Identifier',
                start: 149,
                end: 157,
                name: 'FreePlan',
              },
              list: false,
            },
            nullable: false,
            index: { type: 'Literal', start: 160, end: 161, value: 3 },
          },
          {
            type: 'Field',
            start: 167,
            end: 184,
            identifier: {
              type: 'Identifier',
              start: 167,
              end: 172,
              name: 'users',
            },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              start: 174,
              end: 180,
              identifier: {
                type: 'Identifier',
                start: 174,
                end: 178,
                name: 'User',
              },
              list: true,
            },
            nullable: false,
            index: { type: 'Literal', start: 183, end: 184, value: 4 },
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
  });
});
