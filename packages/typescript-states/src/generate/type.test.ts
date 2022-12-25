import { generateTypeofType } from './type';

/* eslint-disable max-lines-per-function */

const pos = { start: 0, end: 0 };

describe('generate/type', () => {
  describe('generateTypeofType()', () => {
    it('should generate built-in type', () => {
      expect(
        generateTypeofType({
          type: 'TypeExpression',
          identifier: { type: 'Identifier', name: 'String', ...pos },
          list: false,
          ...pos,
        }),
      ).toBe('string');
    });

    it('should generate custom type', () => {
      expect(
        generateTypeofType({
          type: 'TypeExpression',
          identifier: { type: 'Identifier', name: 'Foo', ...pos },
          list: false,
          ...pos,
        }),
      ).toBe('Foo');
    });

    it('should generate list type', () => {
      expect(
        generateTypeofType({
          type: 'TypeExpression',
          identifier: { type: 'Identifier', name: 'Foo', ...pos },
          list: true,
          ...pos,
        }),
      ).toBe('Foo[]');
    });
  });
});
