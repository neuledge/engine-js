import { TokenCursor } from '@/tokens';
import {
  isUnaryExpressionNodeOperator,
  parseUnaryExpressionNode,
} from './unary';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/unary', () => {
  describe('isUnaryExpressionNodeOperator()', () => {
    it('should return true on valid operator', () => {
      expect(isUnaryExpressionNodeOperator('+')).toBe(true);
    });

    it('should return false on invalid operator', () => {
      expect(isUnaryExpressionNodeOperator('foo')).toBe(false);
    });
  });

  describe('parseUnaryExpressionNode()', () => {
    it('should throw on missing operator', () => {
      const cursor = new TokenCursor(``);

      expect(() => parseUnaryExpressionNode(cursor)).toThrow(
        "Expect '!' token",
      );
    });

    it('should throw on missing argument', () => {
      const cursor = new TokenCursor(`+`);

      expect(() => parseUnaryExpressionNode(cursor)).toThrow(
        'Expect literal value',
      );
    });

    it('should parse basic unary expression', () => {
      const cursor = new TokenCursor(`+foo`);

      expect(parseUnaryExpressionNode(cursor)).toMatchObject({
        type: 'UnaryExpression',
        operator: '+',
        argument: {
          type: 'Identifier',
          name: 'foo',
        },
      });
    });

    it('should parse unary expression with multiple operators', () => {
      const cursor = new TokenCursor(`+!foo`);

      expect(parseUnaryExpressionNode(cursor)).toMatchObject({
        type: 'UnaryExpression',
        operator: '+',
        argument: {
          type: 'UnaryExpression',
          operator: '!',
          argument: {
            type: 'Identifier',
            name: 'foo',
          },
        },
      });
    });

    it('should parse unary expression with multiple operators and parentheses', () => {
      const cursor = new TokenCursor(`+!(foo)`);
      const node = parseUnaryExpressionNode(cursor);

      expect(node).toMatchObject({
        type: 'UnaryExpression',
        operator: '+',
        argument: {
          type: 'UnaryExpression',
          operator: '!',
          argument: {
            type: 'Identifier',
            name: 'foo',
          },
        },
      });
    });
  });
});
