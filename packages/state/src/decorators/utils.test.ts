/* eslint-disable max-lines-per-function */

import {
  createDecorator,
  getClassMetadata,
  getPropertyMetadata,
} from './utils.js';

describe('decorators/utils', () => {
  describe('createDecorator()', () => {
    it('should create class decorator', () => {
      const decorator = createDecorator<1 | 2 | 3>('x', 2);

      @decorator
      class Foo {}

      expect(Reflect.getMetadata('x', Foo)).toBe(2);
    });

    it('should create property decorator', () => {
      const decorator = createDecorator<1 | 2 | 3>('x', 2);

      class Foo {
        @decorator
        bar!: string;
      }

      expect(Reflect.getMetadata('x', new Foo(), 'bar')).toBe(2);
    });
  });

  describe('getPropertyMetadata()', () => {
    it('should get property metadata', () => {
      const decorator = createDecorator<1 | 2 | 3>('x', 2);
      const getter = getPropertyMetadata<1 | 2 | 3>('x');

      class Foo {
        @decorator
        bar!: string;
      }

      expect<1 | 2 | 3 | undefined>(getter(new Foo(), 'bar')).toBe(2);
    });

    it('should return undefined when missing property metadata', () => {
      const getter = getPropertyMetadata<1 | 2 | 3>('x');

      class Foo {
        bar!: string;
      }

      expect<1 | 2 | 3 | undefined>(getter(new Foo(), 'bar')).toBe(undefined);
    });
  });

  describe('getClassMetadata()', () => {
    it('should get property metadata', () => {
      const decorator = createDecorator<1 | 2 | 3>('x', 2);
      const getter = getClassMetadata<1 | 2 | 3>('x');

      @decorator
      class Foo {}

      expect<1 | 2 | 3 | undefined>(getter(new Foo())).toBe(2);
    });

    it('should return undefined when missing property metadata', () => {
      const getter = getClassMetadata<1 | 2 | 3>('x');

      class Foo {}

      expect<1 | 2 | 3 | undefined>(getter(new Foo())).toBe(undefined);
    });
  });
});
