import { isBinaryExpressionNodeOperator } from './binary';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/binary', () => {
  describe('isBinaryExpressionNodeOperator()', () => {
    it('should return true on binary operator', () => {
      expect(isBinaryExpressionNodeOperator('+')).toBe(true);
    });

    it('should return false on non-binary operator', () => {
      expect(isBinaryExpressionNodeOperator('foo')).toBe(false);
    });
  });
});
