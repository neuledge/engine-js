import {
  getStoreScalarValueKey,
  isStoreScalarValueEqual,
  uniqueStoreScalarValues,
} from './value';

/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable max-lines-per-function */

describe('value', () => {
  describe('isStoreScalarValueEqual', () => {
    it('should return true if values are strictly equal', () => {
      expect(isStoreScalarValueEqual(1, 1)).toBe(true);
      expect(isStoreScalarValueEqual('a', 'a')).toBe(true);
      expect(isStoreScalarValueEqual(true, true)).toBe(true);
      expect(isStoreScalarValueEqual(false, false)).toBe(true);
      expect(isStoreScalarValueEqual(null, null)).toBe(true);
      expect(isStoreScalarValueEqual(undefined, undefined)).toBe(true);
      expect(isStoreScalarValueEqual(1n, 1n)).toBe(true);
    });

    it('should return false if values are not strictly equal', () => {
      expect(isStoreScalarValueEqual(1, 2)).toBe(false);
      expect(isStoreScalarValueEqual('a', 'b')).toBe(false);
      expect(isStoreScalarValueEqual(true, false)).toBe(false);
      expect(isStoreScalarValueEqual(false, true)).toBe(false);
      expect(isStoreScalarValueEqual(null, undefined)).toBe(false);
      expect(isStoreScalarValueEqual(undefined, null)).toBe(false);
      expect(isStoreScalarValueEqual(1n, 2n)).toBe(false);
    });

    it('should return true if values are deeply equal', () => {
      expect(isStoreScalarValueEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(isStoreScalarValueEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(
        true,
      );
      expect(isStoreScalarValueEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(isStoreScalarValueEqual(Buffer.from('a'), Buffer.from('a'))).toBe(
        true,
      );
    });

    it('should return false if values are not deeply equal', () => {
      expect(isStoreScalarValueEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isStoreScalarValueEqual({ a: 1 }, {})).toBe(false);
      expect(isStoreScalarValueEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(isStoreScalarValueEqual(Buffer.from('a'), Buffer.from('b'))).toBe(
        false,
      );
    });

    it('should return false if values are not of the same type', () => {
      expect(isStoreScalarValueEqual(1, '1')).toBe(false);
      expect(isStoreScalarValueEqual(1, true)).toBe(false);
      expect(isStoreScalarValueEqual(1, null)).toBe(false);
      expect(isStoreScalarValueEqual(1, undefined)).toBe(false);
      expect(isStoreScalarValueEqual(1, 1n)).toBe(false);
      expect(isStoreScalarValueEqual(1n, 1)).toBe(false);
      expect(isStoreScalarValueEqual('1', 1)).toBe(false);
      expect(isStoreScalarValueEqual(true, 1)).toBe(false);
      expect(isStoreScalarValueEqual(null, 1)).toBe(false);
      expect(isStoreScalarValueEqual(undefined, 1)).toBe(false);
      expect(isStoreScalarValueEqual(1n, 1)).toBe(false);
    });

    it('should return false if values are not of the same type (deep)', () => {
      expect(isStoreScalarValueEqual({ a: 1 }, [1])).toBe(false);
      expect(isStoreScalarValueEqual([1], { a: 1 })).toBe(false);
      expect(isStoreScalarValueEqual({ a: 1 }, Buffer.from('a'))).toBe(false);
      expect(isStoreScalarValueEqual(Buffer.from('a'), { a: 1 })).toBe(false);
      expect(isStoreScalarValueEqual([1], Buffer.from('a'))).toBe(false);
      expect(isStoreScalarValueEqual(Buffer.from('a'), [1])).toBe(false);
    });
  });

  describe('uniqueStoreScalarValues', () => {
    it('should return empty array if no values are provided', () => {
      expect(uniqueStoreScalarValues([])).toEqual([]);
    });

    it('should return unique values', () => {
      expect(uniqueStoreScalarValues([1, 2, 1, 2])).toEqual([1, 2]);
    });

    it('should return unique deep values', () => {
      expect(
        uniqueStoreScalarValues([
          1,
          { a: 1 },
          { b: 2 },
          { a: 1 },
          { a: 1, b: 2 },
        ]),
      ).toEqual([1, { a: 1 }, { b: 2 }, { a: 1, b: 2 }]);
    });

    it('should support buffers', () => {
      expect(
        uniqueStoreScalarValues([Buffer.from('a'), Buffer.from('a')]),
      ).toEqual([Buffer.from('a')]);
    });

    it('should support all kind of values', () => {
      expect(
        uniqueStoreScalarValues([
          null,
          1,
          1n,
          true,
          false,
          'a',
          Buffer.from('a'),
          { a: 1 },
          { a: 1, b: 2 },
          [1, 2, 3],
        ]),
      ).toEqual([
        null,
        1,
        1n,
        true,
        false,
        'a',
        Buffer.from('a'),
        { a: 1 },
        { a: 1, b: 2 },
        [1, 2, 3],
      ]);
    });
  });

  describe('getStoreScalarValueKey()', () => {
    it('should return a primitive key for a scalar value', () => {
      expect(getStoreScalarValueKey(1)).toBe(1);
      expect(getStoreScalarValueKey('a')).toBe('"a"');
      expect(getStoreScalarValueKey(true)).toBe(true);
      expect(getStoreScalarValueKey(false)).toBe(false);
      expect(getStoreScalarValueKey(null)).toBeNull();
      expect(getStoreScalarValueKey(undefined)).toBeNull();
      expect(getStoreScalarValueKey(1n)).toBe(1n);
    });

    it('should return a deep key for a deep value', () => {
      expect(getStoreScalarValueKey({ a: 1 })).toBe('{"a":1}');
      expect(getStoreScalarValueKey({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
      expect(getStoreScalarValueKey([1, 2, 3])).toBe('[1,2,3]');
      expect(getStoreScalarValueKey(Buffer.from('a'))).toBe('YQ==');
    });
  });
});
