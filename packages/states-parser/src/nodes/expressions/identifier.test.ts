import { TokenCursor } from '@/tokens';
import { parseIdentifierExpressionNode } from './identifier';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/identifier', () => {
  describe('parseIdentifierExpressionNode()', () => {
    it('should throw on missing identifier', () => {
      const cursor = new TokenCursor(``);

      expect(() => parseIdentifierExpressionNode(cursor)).toThrow(
        'Expect identifier name',
      );
    });

    it('should parse basic identifier', () => {
      const cursor = new TokenCursor(`foo`);

      expect(parseIdentifierExpressionNode(cursor)).toMatchObject({
        type: 'Identifier',
        name: 'foo',
      });
    });

    it('should parse this expression', () => {
      const cursor = new TokenCursor(`this`);

      expect(parseIdentifierExpressionNode(cursor)).toMatchObject({
        type: 'ThisExpression',
        name: 'this',
      });
    });

    it('should parse null literal', () => {
      const cursor = new TokenCursor(`null`);

      expect(parseIdentifierExpressionNode(cursor)).toMatchObject({
        type: 'NullLiteral',
        value: null,
      });
    });
  });
});
