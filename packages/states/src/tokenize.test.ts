import { tokenize } from './tokenize';
import { Token } from './tokens';

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

describe('parser/tokenize', () => {
  describe('tokenize()', () => {
    it('should tokenize empty content', () => {
      expect(tokenize(``)).toEqual([]);
    });

    it('should tokenize strings', () => {
      expect(tokenize(`'foo' "Foo"`)).toEqual<Token[]>([
        { end: 5, kind: "'", start: 0, type: 'String', value: 'foo' },
        { end: 11, kind: '"', start: 6, type: 'String', value: 'Foo' },
      ]);
    });

    it('should tokenize numbers', () => {
      expect(tokenize(`123 0 .53 423.423232`)).toEqual<Token[]>([
        { end: 3, start: 0, type: 'Number', value: 123 },
        { end: 5, start: 4, type: 'Number', value: 0 },
        { end: 9, start: 6, type: 'Number', value: 0.53 },
        { end: 20, start: 10, type: 'Number', value: 423.423_232 },
      ]);
    });

    it('should tokenize words', () => {
      expect(tokenize(`hello world`)).toEqual<Token[]>([
        { end: 5, value: 'hello', start: 0, type: 'Word' },
        { end: 11, value: 'world', start: 6, type: 'Word' },
      ]);
    });

    it('should tokenize field reference with version', () => {
      expect(tokenize(`BasicState@2.foo`)).toEqual<Token[]>([
        { end: 10, value: 'BasicState', start: 0, type: 'Word' },
        { end: 11, value: '@', adjacent: true, start: 10, type: 'Punctuation' },
        { end: 12, value: 2, start: 11, type: 'Number' },
        { end: 13, value: '.', adjacent: true, start: 12, type: 'Punctuation' },
        { end: 16, value: 'foo', start: 13, type: 'Word' },
      ]);
    });

    it('should tokenize basic state', () => {
      expect(
        tokenize(`
      state FreeAccount {
        @id id: PositiveInteger = 1 
      }`),
      ).toEqual<Token[]>([
        { end: 12, value: 'state', start: 7, type: 'Word' },
        { end: 24, value: 'FreeAccount', start: 13, type: 'Word' },
        {
          adjacent: false,
          end: 26,
          value: '{',
          start: 25,
          type: 'Punctuation',
        },
        { adjacent: true, end: 36, value: '@', start: 35, type: 'Punctuation' },
        { end: 38, value: 'id', start: 36, type: 'Word' },
        { end: 41, value: 'id', start: 39, type: 'Word' },
        {
          adjacent: false,
          end: 42,
          value: ':',
          start: 41,
          type: 'Punctuation',
        },
        { end: 58, value: 'PositiveInteger', start: 43, type: 'Word' },
        {
          adjacent: false,
          end: 60,
          value: '=',
          start: 59,
          type: 'Punctuation',
        },
        { end: 62, start: 61, type: 'Number', value: 1 },
        {
          adjacent: false,
          end: 71,
          value: '}',
          start: 70,
          type: 'Punctuation',
        },
      ]);
    });

    it('should tokenize state short description comment', () => {
      expect(
        tokenize(`
      "This is an example state"
      state FooBar {`),
      ).toEqual<Token[]>([
        {
          end: 33,
          kind: '"',
          start: 7,
          type: 'String',
          value: 'This is an example state',
        },
        { end: 45, value: 'state', start: 40, type: 'Word' },
        { end: 52, value: 'FooBar', start: 46, type: 'Word' },
        {
          adjacent: false,
          end: 54,
          value: '{',
          start: 53,
          type: 'Punctuation',
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
          end: 33,
          kind: '"',
          start: 7,
          type: 'String',
          value: 'Description for the type',
        },
        { end: 45, value: 'state', start: 40, type: 'Word' },
        { end: 58, value: 'MyObjectType', start: 46, type: 'Word' },
        {
          adjacent: false,
          end: 60,
          value: '{',
          start: 59,
          type: 'Punctuation',
        },
        {
          end: 194,
          kind: '"""',
          start: 69,
          type: 'String',
          value:
            'Description for field\nSupports **multi-line** description for your [API](http://example.com)!',
        },
        { end: 210, value: 'myField', start: 203, type: 'Word' },
        {
          adjacent: false,
          end: 211,
          value: ':',
          start: 210,
          type: 'Punctuation',
        },
        { end: 218, value: 'String', start: 212, type: 'Word' },
        {
          adjacent: false,
          end: 219,
          value: '!',
          start: 218,
          type: 'Punctuation',
        },
        {
          adjacent: false,
          end: 227,
          value: '}',
          start: 226,
          type: 'Punctuation',
        },
      ]);
    });

    it('should tokenize migration example', () => {
      expect(
        tokenize(`
          # migration function between state versions
          (FreeAccount_Old): FreeAccount => {
            createdAt: Date(timestamp: 0)
          }
          `),
      ).toEqual<Token[]>([
        {
          adjacent: true,
          end: 66,
          value: '(',
          start: 65,
          type: 'Punctuation',
        },
        { end: 81, value: 'FreeAccount_Old', start: 66, type: 'Word' },
        {
          adjacent: true,
          end: 82,
          value: ')',
          start: 81,
          type: 'Punctuation',
        },
        {
          adjacent: false,
          end: 83,
          value: ':',
          start: 82,
          type: 'Punctuation',
        },
        { end: 95, value: 'FreeAccount', start: 84, type: 'Word' },
        {
          adjacent: false,
          end: 98,
          value: '=>',
          start: 96,
          type: 'Punctuation',
        },
        {
          adjacent: false,
          end: 100,
          value: '{',
          start: 99,
          type: 'Punctuation',
        },
        { end: 122, value: 'createdAt', start: 113, type: 'Word' },
        {
          adjacent: false,
          end: 123,
          value: ':',
          start: 122,
          type: 'Punctuation',
        },
        { end: 128, value: 'Date', start: 124, type: 'Word' },
        {
          adjacent: true,
          end: 129,
          value: '(',
          start: 128,
          type: 'Punctuation',
        },
        { end: 138, value: 'timestamp', start: 129, type: 'Word' },
        {
          adjacent: false,
          end: 139,
          value: ':',
          start: 138,
          type: 'Punctuation',
        },
        { end: 141, start: 140, type: 'Number', value: 0 },
        {
          adjacent: false,
          end: 142,
          value: ')',
          start: 141,
          type: 'Punctuation',
        },
        {
          adjacent: false,
          end: 154,
          value: '}',
          start: 153,
          type: 'Punctuation',
        },
      ]);
    });
  });
});
