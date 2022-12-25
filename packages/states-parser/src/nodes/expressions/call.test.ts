import { TokenCursor } from '@/tokens';
import { parseCallExpressionNode } from './call';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/call', () => {
  describe('parseCallExpressionNode()', () => {
    it('should throw on missing opening parenthesis', () => {
      const cursor = new TokenCursor(`Foo`);

      expect(() => parseCallExpressionNode(cursor)).toThrow("Expect '(' token");
    });

    it('should throw on missing closing parenthesis', () => {
      const cursor = new TokenCursor(`Foo(`);

      expect(() => parseCallExpressionNode(cursor)).toThrow(
        'Expect identifier name',
      );
    });

    it('should parse empty call expression', () => {
      const cursor = new TokenCursor(`Foo()`);

      expect(parseCallExpressionNode(cursor)).toMatchObject({
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'Foo',
        },
        arguments: [],
      });
    });

    it('should parse call expression with single argument', () => {
      const cursor = new TokenCursor(`Foo(bar: 1)`);

      expect(parseCallExpressionNode(cursor)).toMatchObject({
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'Foo',
        },
        arguments: [
          {
            type: 'Argument',
            key: {
              type: 'Identifier',
              name: 'bar',
            },
            value: {
              type: 'Literal',
              value: 1,
            },
          },
        ],
      });
    });

    it('should parse call expression with multiple arguments', () => {
      const cursor = new TokenCursor(`Foo(bar: 1, baz: 2)`);

      expect(parseCallExpressionNode(cursor)).toMatchObject({
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'Foo',
        },
        arguments: [
          {
            type: 'Argument',
            key: {
              type: 'Identifier',
              name: 'bar',
            },
            value: {
              type: 'Literal',
              value: 1,
            },
          },
          {
            type: 'Argument',
            key: {
              type: 'Identifier',
              name: 'baz',
            },
            value: {
              type: 'Literal',
              value: 2,
            },
          },
        ],
      });
    });

    it('should parse call expression with multiple arguments and trailing comma', () => {
      const cursor = new TokenCursor(`Foo(bar: 1, baz: 2,)`);

      expect(parseCallExpressionNode(cursor)).toMatchObject({
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'Foo',
        },
        arguments: [
          {
            type: 'Argument',
            key: {
              type: 'Identifier',
              name: 'bar',
            },
            value: {
              type: 'Literal',
              value: 1,
            },
          },
          {
            type: 'Argument',
            key: {
              type: 'Identifier',
              name: 'baz',
            },
            value: {
              type: 'Literal',
              value: 2,
            },
          },
        ],
      });
    });

    it('should parse call expression name only argument', () => {
      const cursor = new TokenCursor(`Foo(bar)`);

      expect(parseCallExpressionNode(cursor)).toMatchObject({
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'Foo',
        },
        arguments: [
          {
            type: 'Argument',
            key: {
              type: 'Identifier',
              name: 'bar',
            },
            value: {
              type: 'Identifier',
              name: 'bar',
            },
          },
        ],
      });
    });
  });
});
