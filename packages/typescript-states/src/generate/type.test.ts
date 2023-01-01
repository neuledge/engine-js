import { StringScalar } from '@neuledge/scalars';
import { generateTypeType } from './type';

/* eslint-disable max-lines-per-function */

describe('generate/type', () => {
  describe('generateTypeType()', () => {
    it('should generate entity', () => {
      expect(
        generateTypeType({
          type: 'EntityExpression',
          node: {} as never,
          entity: StringScalar,
          list: false,
        }),
      ).toBe('$.scalars.String');
    });

    it('should generate list entity', () => {
      expect(
        generateTypeType({
          type: 'EntityExpression',
          node: {} as never,
          entity: StringScalar,
          list: true,
        }),
      ).toBe('$.scalars.String[]');
    });
  });
});
