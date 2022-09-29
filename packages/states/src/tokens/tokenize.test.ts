import { Token } from './token.js';
import { tokenize } from './tokenize.js';
import { TokenType } from './type.js';

const { WORD: W, NUMBER: N, STRING: S, PUNCTUATION: P } = TokenType;

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

describe('parser/tokenize', () => {
  describe('tokenize()', () => {
    it('should tokenize empty content', () => {
      expect(tokenize(``)).toEqual([]);
    });

    it('should tokenize strings', () => {
      expect(tokenize(`'foo' "Foo"`)).toEqual<Token[]>([
        { end: 5, kind: "'", start: 0, type: S, value: 'foo' },
        { end: 11, kind: '"', start: 6, type: S, value: 'Foo' },
      ]);
    });

    it('should tokenize numbers', () => {
      expect(tokenize(`123 0 .53 423.423232`)).toEqual<Token[]>([
        { end: 3, start: 0, type: N, value: 123 },
        { end: 5, start: 4, type: N, value: 0 },
        { end: 9, start: 6, type: N, value: 0.53 },
        { end: 20, start: 10, type: N, value: 423.423_232 },
      ]);
    });

    it('should tokenize words', () => {
      expect(tokenize(`hello world`)).toEqual<Token[]>([
        { end: 5, name: 'hello', start: 0, type: W },
        { end: 11, name: 'world', start: 6, type: W },
      ]);
    });

    it('should tokenize field reference with version', () => {
      expect(tokenize(`BasicState@2.foo`)).toEqual<Token[]>([
        { end: 10, name: 'BasicState', start: 0, type: W },
        { end: 11, kind: '@', adjacent: true, start: 10, type: P },
        { end: 12, value: 2, start: 11, type: N },
        { end: 13, kind: '.', adjacent: true, start: 12, type: P },
        { end: 16, name: 'foo', start: 13, type: W },
      ]);
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
        { adjacent: true, end: 8, kind: '@', start: 7, type: P },
        { end: 13, name: 'index', start: 8, type: W },
        { adjacent: true, end: 14, kind: '(', start: 13, type: P },
        { end: 18, name: 'type', start: 14, type: W },
        { adjacent: false, end: 19, kind: ':', start: 18, type: P },
        { end: 31, kind: '"', start: 20, type: S, value: 'full-text' },
        { adjacent: false, end: 32, kind: ',', start: 31, type: P },
        { end: 39, name: 'fields', start: 33, type: W },
        { adjacent: false, end: 40, kind: ':', start: 39, type: P },
        { adjacent: true, end: 42, kind: '[', start: 41, type: P },
        { end: 48, kind: '"', start: 42, type: S, value: 'name' },
        { adjacent: true, end: 49, kind: ']', start: 48, type: P },
        { adjacent: false, end: 50, kind: ')', start: 49, type: P },
        { end: 62, name: 'state', start: 57, type: W },
        { end: 74, name: 'FreeAccount', start: 63, type: W },
        { adjacent: false, end: 76, kind: '{', start: 75, type: P },
        { adjacent: true, end: 86, kind: '@', start: 85, type: P },
        { end: 88, name: 'id', start: 86, type: W },
        { end: 91, name: 'id', start: 89, type: W },
        { adjacent: false, end: 92, kind: ':', start: 91, type: P },
        { end: 108, name: 'PositiveInteger', start: 93, type: W },
        { adjacent: false, end: 110, kind: '=', start: 109, type: P },
        { end: 112, start: 111, type: N, value: 1 },
        { end: 126, name: 'name', start: 122, type: W },
        { adjacent: false, end: 127, kind: ':', start: 126, type: P },
        { end: 141, name: 'TrimmedString', start: 128, type: W },
        { adjacent: true, end: 142, kind: '(', start: 141, type: P },
        { end: 147, name: 'limit', start: 142, type: W },
        { adjacent: false, end: 148, kind: ':', start: 147, type: P },
        { end: 152, start: 149, type: N, value: 100 },
        { adjacent: false, end: 153, kind: ')', start: 152, type: P },
        { adjacent: false, end: 155, kind: '=', start: 154, type: P },
        { end: 157, start: 156, type: N, value: 2 },
        { end: 171, name: 'plan', start: 167, type: W },
        { adjacent: false, end: 172, kind: ':', start: 171, type: P },
        { end: 181, name: 'FreePlan', start: 173, type: W },
        { adjacent: false, end: 183, kind: '=', start: 182, type: P },
        { end: 185, start: 184, type: N, value: 3 },
        { end: 200, name: 'users', start: 195, type: W },
        { adjacent: false, end: 201, kind: ':', start: 200, type: P },
        { end: 206, name: 'User', start: 202, type: W },
        { adjacent: true, end: 207, kind: '[', start: 206, type: P },
        { adjacent: false, end: 208, kind: ']', start: 207, type: P },
        { adjacent: false, end: 210, kind: '=', start: 209, type: P },
        { end: 212, start: 211, type: N, value: 4 },
        { adjacent: false, end: 221, kind: '}', start: 220, type: P },
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
          end: 33,
          kind: '"',
          start: 7,
          type: S,
          value: 'This is an example state',
        },
        { end: 45, name: 'state', start: 40, type: W },
        { end: 52, name: 'FooBar', start: 46, type: W },
        { adjacent: false, end: 54, kind: '{', start: 53, type: P },
        { end: 65, name: 'id', start: 63, type: W },
        { adjacent: false, end: 66, kind: ':', start: 65, type: P },
        { end: 73, name: 'Number', start: 67, type: W },
        { adjacent: false, end: 75, kind: '=', start: 74, type: P },
        { end: 77, start: 76, type: N, value: 1 },
        { end: 90, name: 'name', start: 86, type: W },
        { adjacent: false, end: 91, kind: ':', start: 90, type: P },
        { end: 98, name: 'String', start: 92, type: W },
        { adjacent: false, end: 99, kind: '?', start: 98, type: P },
        { adjacent: false, end: 101, kind: '=', start: 100, type: P },
        { end: 103, start: 102, type: N, value: 2 },
        { adjacent: false, end: 111, kind: '}', start: 110, type: P },
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
          type: S,
          value: 'Description for the type',
        },
        { end: 45, name: 'state', start: 40, type: W },
        { end: 58, name: 'MyObjectType', start: 46, type: W },
        { adjacent: false, end: 60, kind: '{', start: 59, type: P },
        {
          end: 194,
          kind: '"""',
          start: 69,
          type: S,
          value:
            'Description for field\nSupports **multi-line** description for your [API](http://example.com)!',
        },
        { end: 210, name: 'myField', start: 203, type: W },
        { adjacent: false, end: 211, kind: ':', start: 210, type: P },
        { end: 218, name: 'String', start: 212, type: W },
        { adjacent: false, end: 219, kind: '!', start: 218, type: P },
        { adjacent: false, end: 227, kind: '}', start: 226, type: P },
      ]);
    });

    it('should tokenize migration example', () => {
      expect(
        tokenize(`
          state FreeAccount:2 extends FreeAccount:1 {
            createdAt: Date = 1
          }
            
          # migration function between state versions
          (FreeAccount:1): FreeAccount:2 => {
            createdAt: Date(timestamp: 0)
          }
          `),
      ).toEqual<Token[]>([
        { end: 16, name: 'state', start: 11, type: W },
        { end: 28, name: 'FreeAccount', start: 17, type: W },
        { adjacent: true, end: 29, kind: ':', start: 28, type: P },
        { end: 30, start: 29, type: N, value: 2 },
        { end: 38, name: 'extends', start: 31, type: W },
        { end: 50, name: 'FreeAccount', start: 39, type: W },
        { adjacent: true, end: 51, kind: ':', start: 50, type: P },
        { end: 52, start: 51, type: N, value: 1 },
        { adjacent: false, end: 54, kind: '{', start: 53, type: P },
        { end: 76, name: 'createdAt', start: 67, type: W },
        { adjacent: false, end: 77, kind: ':', start: 76, type: P },
        { end: 82, name: 'Date', start: 78, type: W },
        { adjacent: false, end: 84, kind: '=', start: 83, type: P },
        { end: 86, start: 85, type: N, value: 1 },
        { adjacent: false, end: 98, kind: '}', start: 97, type: P },
        { adjacent: true, end: 177, kind: '(', start: 176, type: P },
        { end: 188, name: 'FreeAccount', start: 177, type: W },
        { adjacent: true, end: 189, kind: ':', start: 188, type: P },
        { end: 190, start: 189, type: N, value: 1 },
        { adjacent: true, end: 191, kind: ')', start: 190, type: P },
        { adjacent: false, end: 192, kind: ':', start: 191, type: P },
        { end: 204, name: 'FreeAccount', start: 193, type: W },
        { adjacent: true, end: 205, kind: ':', start: 204, type: P },
        { end: 206, start: 205, type: N, value: 2 },
        { adjacent: false, end: 209, kind: '=>', start: 207, type: P },
        { adjacent: false, end: 211, kind: '{', start: 210, type: P },
        { end: 233, name: 'createdAt', start: 224, type: W },
        { adjacent: false, end: 234, kind: ':', start: 233, type: P },
        { end: 239, name: 'Date', start: 235, type: W },
        { adjacent: true, end: 240, kind: '(', start: 239, type: P },
        { end: 249, name: 'timestamp', start: 240, type: W },
        { adjacent: false, end: 250, kind: ':', start: 249, type: P },
        { end: 252, start: 251, type: N, value: 0 },
        { adjacent: false, end: 253, kind: ')', start: 252, type: P },
        { adjacent: false, end: 265, kind: '}', start: 264, type: P },
      ]);
    });
  });
});
