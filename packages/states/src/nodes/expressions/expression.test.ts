import { Tokenizer } from '@/tokenizer';
import { parseExpressionNode } from './expression';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/expression', () => {
  describe('parseExpressionNode()', () => {
    it('should throw on missing expression', () => {
      const cursor = new Tokenizer(``);

      expect(() => parseExpressionNode(cursor)).toThrow('Expect literal value');
    });

    it('should throw on unknown punctuation', () => {
      const cursor = new Tokenizer(`.foo`);

      expect(() => parseExpressionNode(cursor)).toThrow('Expect literal value');
    });

    it('should parse basic expression', () => {
      const cursor = new Tokenizer(`foo`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'Identifier',
        name: 'foo',
      });
    });

    it('should parse expression with multiple operators', () => {
      const cursor = new Tokenizer(`foo + bar`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'BinaryExpression',
        operator: '+',
        left: {
          type: 'Identifier',
          name: 'foo',
        },
        right: {
          type: 'Identifier',
          name: 'bar',
        },
      });
    });

    it('should parse expression with multiple operators and parentheses', () => {
      const cursor = new Tokenizer(`(foo + bar) * baz`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'BinaryExpression',
        operator: '*',
        left: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'Identifier',
            name: 'foo',
          },
          right: {
            type: 'Identifier',
            name: 'bar',
          },
        },
        right: {
          type: 'Identifier',
          name: 'baz',
        },
      });
    });

    it('should parse expression with parentheses', () => {
      const cursor = new Tokenizer(`(foo)`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'Identifier',
        name: 'foo',
      });
    });

    it('should parse unary expression', () => {
      const cursor = new Tokenizer(`!foo`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'UnaryExpression',
        operator: '!',
        argument: {
          type: 'Identifier',
          name: 'foo',
        },
      });
    });

    it('should parse literal expression', () => {
      const cursor = new Tokenizer(`"foo"`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'Literal',
        value: 'foo',
      });
    });

    it('should parse member expression', () => {
      const cursor = new Tokenizer(`foo.bar`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'foo',
        },
        property: {
          type: 'Identifier',
          name: 'bar',
        },
      });
    });

    it('should parse short call expression', () => {
      const cursor = new Tokenizer(`Foo(bar)`);

      expect(parseExpressionNode(cursor)).toMatchObject({
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

    it('should parse long call expression', () => {
      const cursor = new Tokenizer(`Foo(bar: baz)`);

      expect(parseExpressionNode(cursor)).toMatchObject({
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
              name: 'baz',
            },
          },
        ],
      });
    });

    it('should parse identifier expression', () => {
      const cursor = new Tokenizer(`this`);

      expect(parseExpressionNode(cursor)).toMatchObject({
        type: 'ThisExpression',
        name: 'this',
      });
    });
  });
});
