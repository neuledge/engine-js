import { Token } from './token.js';
import { tokenize } from './tokenize.js';
import { TokenType } from './type.js';

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

describe('parser/tokenize', () => {
  describe('tokenize()', () => {
    it('should tokenize empty string', () => {
      expect(tokenize(``)).toEqual([]);
    });

    it('should tokenize basic state', () => {
      expect(
        tokenize(`
      @index(type: "full-text", fields: ["name"])
      state FreeAccount {
        @id id: PositiveInteger = 1 
        name: TrimmedString(limit: 100) = 2 
        plan: FreePlan = 3 
        users: User[] = 4 
      }`),
      ).toEqual<Token[]>([
        {
          column: 6,
          kind: '@',
          line: 2,
          raw: '@',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 7,
          line: 2,
          name: 'index',
          raw: 'index',
          type: TokenType.WORD,
        },
        {
          column: 12,
          kind: '(',
          line: 2,
          raw: '(',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 13,
          line: 2,
          name: 'type',
          raw: 'type',
          type: TokenType.WORD,
        },
        {
          column: 17,
          kind: ':',
          line: 2,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 19,
          kind: '"',
          line: 2,
          raw: '"full-text"',
          type: TokenType.STRING,
          value: 'full-text',
        },
        {
          column: 30,
          kind: ',',
          line: 2,
          raw: ',',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 32,
          line: 2,
          name: 'fields',
          raw: 'fields',
          type: TokenType.WORD,
        },
        {
          column: 38,
          kind: ':',
          line: 2,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 40,
          kind: '[',
          line: 2,
          raw: '[',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 41,
          kind: '"',
          line: 2,
          raw: '"name"',
          type: TokenType.STRING,
          value: 'name',
        },
        {
          column: 47,
          kind: ']',
          line: 2,
          raw: ']',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 48,
          kind: ')',
          line: 2,
          raw: ')',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 6,
          line: 3,
          name: 'state',
          raw: 'state',
          type: TokenType.WORD,
        },
        {
          column: 12,
          line: 3,
          name: 'FreeAccount',
          raw: 'FreeAccount',
          type: TokenType.WORD,
        },
        {
          column: 24,
          kind: '{',
          line: 3,
          raw: '{',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 8,
          kind: '@',
          line: 4,
          raw: '@',
          type: TokenType.PUNCTUATION,
        },
        { column: 9, line: 4, name: 'id', raw: 'id', type: TokenType.WORD },
        { column: 12, line: 4, name: 'id', raw: 'id', type: TokenType.WORD },
        {
          column: 14,
          kind: ':',
          line: 4,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 16,
          line: 4,
          name: 'PositiveInteger',
          raw: 'PositiveInteger',
          type: TokenType.WORD,
        },
        {
          column: 32,
          kind: '=',
          line: 4,
          raw: '=',
          type: TokenType.PUNCTUATION,
        },
        { column: 34, line: 4, raw: '1', type: TokenType.NUMBER, value: 1 },
        { column: 8, line: 5, name: 'name', raw: 'name', type: TokenType.WORD },
        {
          column: 12,
          kind: ':',
          line: 5,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 14,
          line: 5,
          name: 'TrimmedString',
          raw: 'TrimmedString',
          type: TokenType.WORD,
        },
        {
          column: 27,
          kind: '(',
          line: 5,
          raw: '(',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 28,
          line: 5,
          name: 'limit',
          raw: 'limit',
          type: TokenType.WORD,
        },
        {
          column: 33,
          kind: ':',
          line: 5,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        { column: 35, line: 5, raw: '100', type: TokenType.NUMBER, value: 100 },
        {
          column: 38,
          kind: ')',
          line: 5,
          raw: ')',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 40,
          kind: '=',
          line: 5,
          raw: '=',
          type: TokenType.PUNCTUATION,
        },
        { column: 42, line: 5, raw: '2', type: TokenType.NUMBER, value: 2 },
        { column: 8, line: 6, name: 'plan', raw: 'plan', type: TokenType.WORD },
        {
          column: 12,
          kind: ':',
          line: 6,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 14,
          line: 6,
          name: 'FreePlan',
          raw: 'FreePlan',
          type: TokenType.WORD,
        },
        {
          column: 23,
          kind: '=',
          line: 6,
          raw: '=',
          type: TokenType.PUNCTUATION,
        },
        { column: 25, line: 6, raw: '3', type: TokenType.NUMBER, value: 3 },
        {
          column: 8,
          line: 7,
          name: 'users',
          raw: 'users',
          type: TokenType.WORD,
        },
        {
          column: 13,
          kind: ':',
          line: 7,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 15,
          line: 7,
          name: 'User',
          raw: 'User',
          type: TokenType.WORD,
        },
        {
          column: 19,
          kind: '[',
          line: 7,
          raw: '[',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 20,
          kind: ']',
          line: 7,
          raw: ']',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 22,
          kind: '=',
          line: 7,
          raw: '=',
          type: TokenType.PUNCTUATION,
        },
        { column: 24, line: 7, raw: '4', type: TokenType.NUMBER, value: 4 },
        {
          column: 6,
          kind: '}',
          line: 8,
          raw: '}',
          type: TokenType.PUNCTUATION,
        },
      ]);
    });

    it('should tokenize state short description comment', () => {
      expect(
        tokenize(`
      "This is an example state"
      state FooBar {
        id: Number = 1
        name: String? = 2
      }`),
      ).toEqual<Token[]>([
        {
          column: 6,
          kind: '"',
          line: 2,
          raw: '"This is an example state"',
          type: TokenType.STRING,
          value: 'This is an example state',
        },
        {
          column: 6,
          line: 3,
          name: 'state',
          raw: 'state',
          type: TokenType.WORD,
        },
        {
          column: 12,
          line: 3,
          name: 'FooBar',
          raw: 'FooBar',
          type: TokenType.WORD,
        },
        {
          column: 19,
          kind: '{',
          line: 3,
          raw: '{',
          type: TokenType.PUNCTUATION,
        },
        { column: 8, line: 4, name: 'id', raw: 'id', type: TokenType.WORD },
        {
          column: 10,
          kind: ':',
          line: 4,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 12,
          line: 4,
          name: 'Number',
          raw: 'Number',
          type: TokenType.WORD,
        },
        {
          column: 19,
          kind: '=',
          line: 4,
          raw: '=',
          type: TokenType.PUNCTUATION,
        },
        { column: 21, line: 4, raw: '1', type: TokenType.NUMBER, value: 1 },
        { column: 8, line: 5, name: 'name', raw: 'name', type: TokenType.WORD },
        {
          column: 12,
          kind: ':',
          line: 5,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 14,
          line: 5,
          name: 'String',
          raw: 'String',
          type: TokenType.WORD,
        },
        {
          column: 20,
          kind: '?',
          line: 5,
          raw: '?',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 22,
          kind: '=',
          line: 5,
          raw: '=',
          type: TokenType.PUNCTUATION,
        },
        { column: 24, line: 5, raw: '2', type: TokenType.NUMBER, value: 2 },
        {
          column: 6,
          kind: '}',
          line: 6,
          raw: '}',
          type: TokenType.PUNCTUATION,
        },
      ]);
    });

    it('should tokenize long description comment', () => {
      expect(
        tokenize(`
      "Description for the type"
      state MyObjectType {
        """
        Description for field
        Supports **multi-line** description for your [API](http://example.com)!
        """
        myField: String!
      }`),
      ).toEqual<Token[]>([
        {
          column: 6,
          kind: '"',
          line: 2,
          raw: '"Description for the type"',
          type: TokenType.STRING,
          value: 'Description for the type',
        },
        {
          column: 6,
          line: 3,
          name: 'state',
          raw: 'state',
          type: TokenType.WORD,
        },
        {
          column: 12,
          line: 3,
          name: 'MyObjectType',
          raw: 'MyObjectType',
          type: TokenType.WORD,
        },
        {
          column: 25,
          kind: '{',
          line: 3,
          raw: '{',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 8,
          kind: '"""',
          line: 4,
          raw: '"""\n        Description for field\n        Supports **multi-line** description for your [API](http://example.com)!\n        """',
          type: TokenType.STRING,
          value:
            'Description for field\nSupports **multi-line** description for your [API](http://example.com)!',
        },
        {
          column: 8,
          line: 8,
          name: 'myField',
          raw: 'myField',
          type: TokenType.WORD,
        },
        {
          column: 15,
          kind: ':',
          line: 8,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 17,
          line: 8,
          name: 'String',
          raw: 'String',
          type: TokenType.WORD,
        },
        {
          column: 23,
          kind: '!',
          line: 8,
          raw: '!',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 6,
          kind: '}',
          line: 9,
          raw: '}',
          type: TokenType.PUNCTUATION,
        },
      ]);
    });

    it('should tokenize migration example', () => {
      expect(
        tokenize(`
        state FreeAccount {
            +FreeAccount:1.*
            createdAt: Date = 1
          }
            
          # migration function between state versions
          (FreeAccount:1): FreeAccount => {
            createdAt: Date(timestamp: 0)
          }
          `),
      ).toEqual<Token[]>([
        {
          column: 8,
          line: 2,
          name: 'state',
          raw: 'state',
          type: TokenType.WORD,
        },
        {
          column: 14,
          line: 2,
          name: 'FreeAccount',
          raw: 'FreeAccount',
          type: TokenType.WORD,
        },
        {
          column: 26,
          kind: '{',
          line: 2,
          raw: '{',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 12,
          kind: '+',
          line: 3,
          raw: '+',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 13,
          line: 3,
          name: 'FreeAccount',
          raw: 'FreeAccount',
          type: TokenType.WORD,
        },
        {
          column: 24,
          kind: ':',
          line: 3,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        { column: 25, line: 3, raw: '1', type: TokenType.NUMBER, value: 1 },
        {
          column: 26,
          kind: '.',
          line: 3,
          raw: '.',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 27,
          kind: '*',
          line: 3,
          raw: '*',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 12,
          line: 4,
          name: 'createdAt',
          raw: 'createdAt',
          type: TokenType.WORD,
        },
        {
          column: 21,
          kind: ':',
          line: 4,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 23,
          line: 4,
          name: 'Date',
          raw: 'Date',
          type: TokenType.WORD,
        },
        {
          column: 28,
          kind: '=',
          line: 4,
          raw: '=',
          type: TokenType.PUNCTUATION,
        },
        { column: 30, line: 4, raw: '1', type: TokenType.NUMBER, value: 1 },
        {
          column: 10,
          kind: '}',
          line: 5,
          raw: '}',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 10,
          kind: '(',
          line: 8,
          raw: '(',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 11,
          line: 8,
          name: 'FreeAccount',
          raw: 'FreeAccount',
          type: TokenType.WORD,
        },
        {
          column: 22,
          kind: ':',
          line: 8,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        { column: 23, line: 8, raw: '1', type: TokenType.NUMBER, value: 1 },
        {
          column: 24,
          kind: ')',
          line: 8,
          raw: ')',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 25,
          kind: ':',
          line: 8,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 27,
          line: 8,
          name: 'FreeAccount',
          raw: 'FreeAccount',
          type: TokenType.WORD,
        },
        {
          column: 39,
          kind: '=>',
          line: 8,
          raw: '=>',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 42,
          kind: '{',
          line: 8,
          raw: '{',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 12,
          line: 9,
          name: 'createdAt',
          raw: 'createdAt',
          type: TokenType.WORD,
        },
        {
          column: 21,
          kind: ':',
          line: 9,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 23,
          line: 9,
          name: 'Date',
          raw: 'Date',
          type: TokenType.WORD,
        },
        {
          column: 27,
          kind: '(',
          line: 9,
          raw: '(',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 28,
          line: 9,
          name: 'timestamp',
          raw: 'timestamp',
          type: TokenType.WORD,
        },
        {
          column: 37,
          kind: ':',
          line: 9,
          raw: ':',
          type: TokenType.PUNCTUATION,
        },
        { column: 39, line: 9, raw: '0', type: TokenType.NUMBER, value: 0 },
        {
          column: 40,
          kind: ')',
          line: 9,
          raw: ')',
          type: TokenType.PUNCTUATION,
        },
        {
          column: 10,
          kind: '}',
          line: 10,
          raw: '}',
          type: TokenType.PUNCTUATION,
        },
      ]);
    });
  });
});
