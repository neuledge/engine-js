import { StringScalar } from '@neuledge/scalars';
import { State } from '@neuledge/states';
import { generateEntityType } from './entity';

/* eslint-disable max-lines-per-function */

describe('generate/entity', () => {
  describe('generateEntityType()', () => {
    const FooState: State = {
      type: 'State',
      node: {} as never,
      name: 'Foo',
    } as never;

    it('should generate built-in scalar', () => {
      expect(generateEntityType(StringScalar)).toBe('$.scalars.String');
    });

    it('should generate custom scalar', () => {
      expect(
        generateEntityType({
          type: 'Scalar',
          node: {} as never,
          shape: {} as never,
          name: 'MyId',
          encode: (value: string) => value,
        }),
      ).toBe('MyId');
    });

    it('should generate state', () => {
      expect(generateEntityType(FooState)).toBe('$.Id<typeof Foo>');
    });

    it('should generate either', () => {
      expect(
        generateEntityType({
          type: 'Either',
          name: 'MyEither',
          node: {} as never,
          states: [FooState],
        }),
      ).toBe('$.Id<typeof MyEither[number]>');
    });

    it('should throw on unknown type', () => {
      expect(() => generateEntityType({ type: 'Unknown' } as never)).toThrow();
    });
  });
});
