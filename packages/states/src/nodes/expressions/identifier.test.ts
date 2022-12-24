import { Tokenizer } from '@/tokenizer';
import { parseIdentifierExpressionNode } from './identifier';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/identifier', () => {
  describe('parseIdentifierExpressionNode()', () => {
    it('should throw on missing identifier', () => {
      const cursor = new Tokenizer(``);

      expect(() => parseIdentifierExpressionNode(cursor)).toThrow(
        'Expect identifier name',
      );
    });

    it('should parse basic identifier', () => {
      const cursor = new Tokenizer(`foo`);

      expect(parseIdentifierExpressionNode(cursor)).toMatchObject({
        type: 'Identifier',
        name: 'foo',
      });
    });

    it('should parse this expression', () => {
      const cursor = new Tokenizer(`this`);

      expect(parseIdentifierExpressionNode(cursor)).toMatchObject({
        type: 'ThisExpression',
        name: 'this',
      });
    });

    it('should parse null literal', () => {
      const cursor = new Tokenizer(`null`);

      expect(parseIdentifierExpressionNode(cursor)).toMatchObject({
        type: 'NullLiteral',
        value: null,
      });
    });
  });
});
