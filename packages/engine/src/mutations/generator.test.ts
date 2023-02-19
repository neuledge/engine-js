import { Category } from '@/definitions/__fixtures__/category-post-example';
import { MutationGenerator } from './generator';

/* eslint-disable max-lines-per-function */

describe('engine/mutations/generator', () => {
  describe('MutationGenerator()', () => {
    it('should return an "InitMany" proxy', () => {
      const fn = jest.fn().mockReturnValue(123);

      const proxy = MutationGenerator('InitMany', [Category], fn);

      expect(proxy.create({ name: 'foo' }, { name: 'bar' })).toBe(123);

      expect(proxy['update' as never]).toBeUndefined();
      expect(proxy['delete' as never]).toBeUndefined();

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith({
        type: 'InitMany',
        states: [Category],
        method: 'create',
        args: [{ name: 'foo' }, { name: 'bar' }],
      });
    });

    it('should return an "InitOne" proxy', () => {
      const fn = jest.fn().mockReturnValue(123);

      const proxy = MutationGenerator('InitOne', [Category], fn);

      expect(proxy.create({ name: 'foo' })).toBe(123);

      expect(proxy['update' as never]).toBeUndefined();
      expect(proxy['delete' as never]).toBeUndefined();

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith({
        type: 'InitOne',
        states: [Category],
        method: 'create',
        args: [{ name: 'foo' }],
      });
    });

    for (const type of [
      'AlterMany',
      'AlterFirst',
      'AlterFirstOrThrow',
      'AlterUnique',
      'AlterUniqueOrThrow',
    ] as const) {
      it(`should return an "${type}" proxy`, () => {
        const fn = jest.fn().mockReturnValue(123);

        const proxy = MutationGenerator(type, [Category], fn);

        expect(proxy.update({ name: 'foo' })).toBe(123);
        expect(proxy.delete()).toBe(123);

        expect(proxy['create' as never]).toBeUndefined();

        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenNthCalledWith(1, {
          type,
          states: [Category],
          method: 'update',
          args: [{ name: 'foo' }],
        });
        expect(fn).toHaveBeenNthCalledWith(2, {
          type,
          states: [Category],
          method: 'delete',
          args: [{}],
        });
      });
    }
  });
});
