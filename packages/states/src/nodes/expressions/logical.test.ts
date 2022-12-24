import { isLogicalExpressionNodeOperator } from './logical';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/logical', () => {
  describe('isLogicalExpressionNodeOperator()', () => {
    it('should return true on logical operator', () => {
      expect(isLogicalExpressionNodeOperator('&&')).toBe(true);
    });

    it('should return false on non-logical operator', () => {
      expect(isLogicalExpressionNodeOperator('foo')).toBe(false);
    });
  });
});
