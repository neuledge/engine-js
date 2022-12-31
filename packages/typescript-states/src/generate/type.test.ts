import { StringScalar } from '@neuledge/scalars';
import { State } from '@neuledge/states';
import { generateTypeofType } from './type';

/* eslint-disable max-lines-per-function */

describe('generate/type', () => {
  describe('generateTypeofType()', () => {
    const FooState: State = {
      type: 'State',
      node: {} as never,
      name: 'Foo',
      fields: {},
      indexes: [],
      primaryKey: { fields: {}, unique: true },
      mutations: {},
    };

    it('should generate built-in type', () => {
      expect(
        generateTypeofType({
          type: 'EntityExpression',
          node: {} as never,
          entity: StringScalar,
          list: false,
        }),
      ).toBe('String');
    });

    it('should generate state type', () => {
      expect(
        generateTypeofType({
          type: 'EntityExpression',
          node: {} as never,
          entity: FooState,
          list: false,
        }),
      ).toBe('Foo');
    });

    it('should generate list type', () => {
      expect(
        generateTypeofType({
          type: 'EntityExpression',
          node: {} as never,
          entity: FooState,
          list: true,
        }),
      ).toBe('Foo[]');
    });
  });
});
