import { TokensParser } from '@/tokens/index.js';
import {
  parseTypeNode,
  TypeExpressionNode,
  TypeGeneratorNode,
} from './type.js';

/* eslint-disable max-lines-per-function */

describe('ast/type', () => {
  describe('parseTypeNode()', () => {
    it('should parse type expression', () => {
      const cursor = new TokensParser(`Int = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeExpressionNode>({
        type: 'TypeExpression',
        start: 0,
        end: 3,
        identifier: { type: 'Identifier', start: 0, end: 3, name: 'Int' },
        list: false,
      });
      expect(cursor.index).toBe(1);
    });

    it('should parse type expression with list', () => {
      const cursor = new TokensParser(`Int[] = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeExpressionNode>({
        type: 'TypeExpression',
        start: 0,
        end: 5,
        identifier: { type: 'Identifier', start: 0, end: 3, name: 'Int' },
        list: true,
      });
      expect(cursor.index).toBe(3);
    });

    it('should throw on string', () => {
      const cursor = new TokensParser(`'Int' = 5`);

      expect(() => parseTypeNode(cursor)).toThrow('Expect identifier name');
      expect(cursor.index).toBe(0);
    });

    it('should parse type expression with empty arguments', () => {
      const cursor = new TokensParser(`Int() = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeExpressionNode>({
        type: 'TypeExpression',
        start: 0,
        end: 5,
        identifier: { type: 'Identifier', start: 0, end: 3, name: 'Int' },
        list: false,
      });
      expect(cursor.index).toBe(3);
    });

    it('should parse type generator with argument', () => {
      const cursor = new TokensParser(`Int(foo: 1) = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeGeneratorNode>({
        type: 'TypeGenerator',
        start: 0,
        end: 11,
        identifier: { type: 'Identifier', start: 0, end: 3, name: 'Int' },
        arguments: [
          {
            type: 'Argument',
            start: 4,
            end: 10,
            key: { type: 'Identifier', start: 4, end: 7, name: 'foo' },
            value: { type: 'Literal', start: 9, end: 10, value: 1 },
          },
        ],
      });
      expect(cursor.index).toBe(6);
    });
  });
});
