import { Tokenizer } from '@/tokenizer';
import { parseStateFieldNodes, StateFieldNode } from './state-field';

/* eslint-disable max-lines-per-function */

describe('ast/state-field', () => {
  describe('parseStateFieldNodes()', () => {
    it('should parse empty fields', () => {
      const cursor = new Tokenizer(`{}`);

      expect(parseStateFieldNodes(cursor)).toEqual([]);
      expect(cursor.index).toBe(2);
    });

    it('should parse basic field', () => {
      const cursor = new Tokenizer(`{ id: PositiveInteger = 1 }`);

      expect(parseStateFieldNodes(cursor)).toEqual<StateFieldNode[]>([
        {
          type: 'Field',
          description: undefined,
          decorators: [],
          key: { end: 4, name: 'id', start: 2, type: 'Identifier' },
          start: 2,
          end: 25,
          valueType: {
            type: 'TypeExpression',
            start: 6,
            end: 21,
            identifier: {
              type: 'Identifier',
              name: 'PositiveInteger',
              start: 6,
              end: 21,
            },
            list: false,
          },
          index: { type: 'Literal', start: 24, end: 25, value: 1 },
          nullable: false,
        },
      ]);
    });

    it('should parse optional field', () => {
      const cursor = new Tokenizer(`{ 
        id?: PositiveInteger = 1
      }`);

      expect(parseStateFieldNodes(cursor)).toMatchObject([
        {
          type: 'Field',
          nullable: true,
        },
      ]);
    });

    it('should throw on excluded field without parent state', () => {
      const cursor = new Tokenizer(`{ 
        -id
      }`);

      expect(() => parseStateFieldNodes(cursor, false)).toThrow(
        'Unexpected excluded field on state without a parent state',
      );
    });

    it('should parse excluded field', () => {
      const cursor = new Tokenizer(`{ 
        -id
      }`);

      expect(parseStateFieldNodes(cursor, true)).toMatchObject([
        {
          type: 'ExcludedField',
          key: { type: 'Identifier', name: 'id' },
        },
      ]);
    });

    it('should throw on excluded reference field', () => {
      const cursor = new Tokenizer(`{ 
        -OtherState.id = 1
      }`);

      expect(() => parseStateFieldNodes(cursor, true)).toThrow(
        'Expect identifier name',
      );
    });

    it('should parse reference field', () => {
      const cursor = new Tokenizer(`{ 
        OtherState.id = 1
      }`);

      expect(parseStateFieldNodes(cursor)).toMatchObject([
        {
          type: 'ReferenceField',
          state: { type: 'Identifier', name: 'OtherState' },
          key: { type: 'Identifier', name: 'id' },
          index: { type: 'Literal', value: 1 },
        },
      ]);
    });

    it('should parse multiple fields', () => {
      const cursor = new Tokenizer(`{ 
        -foo
        id: PositiveInteger = 1
        name?: String(limit: 100) = 2
        OtherState.test = 3
      }`);

      expect(parseStateFieldNodes(cursor, true)).toMatchObject([
        {
          type: 'ExcludedField',
          key: { type: 'Identifier', name: 'foo' },
        },
        {
          type: 'Field',
          key: { type: 'Identifier', name: 'id' },
          nullable: false,
        },
        {
          type: 'Field',
          key: { type: 'Identifier', name: 'name' },
          nullable: true,
        },
        {
          type: 'ReferenceField',
          state: { type: 'Identifier', name: 'OtherState' },
          key: { type: 'Identifier', name: 'test' },
          index: { type: 'Literal', value: 3 },
        },
      ]);
    });

    it('should throw on duplicate fields', () => {
      const cursor = new Tokenizer(`{ 
        -foo
        id: PositiveInteger = 1
        foo?: String(limit: 100) = 2
        OtherState.test = 3
      }`);

      expect(() => parseStateFieldNodes(cursor, true)).toThrow(
        "Duplicate field name 'foo'",
      );
    });

    it('should throw on duplicate indexes', () => {
      const cursor = new Tokenizer(`{ 
        -foo
        id: PositiveInteger = 1
        name?: String(limit: 100) = 2
        OtherState.test = 2
      }`);

      expect(() => parseStateFieldNodes(cursor, true)).toThrow(
        "Duplicate index for field name 'name'",
      );
    });

    it('should parse field description', () => {
      const cursor = new Tokenizer(`{ 
        "id desc"
        id: PositiveInteger = 1
      }`);

      expect(parseStateFieldNodes(cursor)).toMatchObject([
        {
          type: 'Field',
          description: {
            type: 'Description',
            value: 'id desc',
          },
          key: { type: 'Identifier', name: 'id' },
        },
      ]);
    });

    it('should parse field decorator', () => {
      const cursor = new Tokenizer(`{ 
        @foo id: PositiveInteger = 1
      }`);

      expect(parseStateFieldNodes(cursor)).toMatchObject([
        {
          type: 'Field',
          decorators: [
            {
              type: 'Decorator',
              callee: { type: 'Identifier', name: 'foo' },
            },
          ],
          key: { type: 'Identifier', name: 'id' },
        },
      ]);
    });

    it('should parse field decorators and description', () => {
      const cursor = new Tokenizer(`{ 
        """
        hi
        there!
        """
        @foo @bar id: PositiveInteger = 1
      }`);

      expect(parseStateFieldNodes(cursor)).toMatchObject([
        {
          type: 'Field',
          description: {
            type: 'Description',
            value: 'hi\nthere!',
          },
          decorators: [
            {
              type: 'Decorator',
              callee: { type: 'Identifier', name: 'foo' },
            },
            {
              type: 'Decorator',
              callee: { type: 'Identifier', name: 'bar' },
            },
          ],
          key: { type: 'Identifier', name: 'id' },
        },
      ]);
    });
  });
});
