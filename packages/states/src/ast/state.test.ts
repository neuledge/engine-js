import { TokensParser } from '../tokens/index.js';
import { parseStateNode, StateNode } from './state.js';

/* eslint-disable max-lines-per-function */

describe('ast/state', () => {
  describe('parseStateNode()', () => {
    it('should parse example state', () => {
      const cursor = new TokensParser(
        null,
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
        description: undefined,
        identifier: { type: 'Identifier', name: 'FreeAccount' },
        fields: [
          {
            type: 'Field',
            identifier: { name: 'id', type: 'Identifier' },
            decorators: [
              {
                arguments: [],
                callee: { name: 'id', type: 'Identifier' },
                type: 'Decorator',
              },
            ],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              identifier: { name: 'PositiveInteger', type: 'Identifier' },
              list: false,
            },
            nullable: false,
            index: 1,
          },
          {
            type: 'Field',
            identifier: { name: 'name', type: 'Identifier' },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeGenerator',
              identifier: { name: 'TrimmedString', type: 'Identifier' },
              arguments: [
                {
                  key: { name: 'limit', type: 'Identifier' },
                  type: 'Argument',
                  value: { type: 'Literal', value: 100 },
                },
              ],
            },
            nullable: false,
            index: 2,
          },
          {
            type: 'Field',
            identifier: { name: 'plan', type: 'Identifier' },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              identifier: { name: 'FreePlan', type: 'Identifier' },
              list: false,
            },
            nullable: false,
            index: 3,
          },
          {
            type: 'Field',
            identifier: {
              type: 'Identifier',
              name: 'users',
            },
            decorators: [],
            description: undefined,
            fieldType: {
              type: 'TypeExpression',
              identifier: {
                type: 'Identifier',
                name: 'User',
              },
              list: true,
            },
            index: 4,
            nullable: false,
          },
        ],
        decorators: [
          {
            type: 'Decorator',
            callee: { name: 'index', type: 'Identifier' },
            arguments: [
              {
                type: 'Argument',
                key: { name: 'type', type: 'Identifier' },
                value: { type: 'Literal', value: 'full-text' },
              },
              {
                type: 'Argument',
                key: { name: 'fields', type: 'Identifier' },
                value: { type: 'Literal', value: ['name'] },
              },
            ],
          },
        ],
      });
    });
  });
});
