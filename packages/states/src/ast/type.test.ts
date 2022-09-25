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
      const cursor = new TokensParser(null, `Int = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeExpressionNode>({
        type: 'TypeExpression',
        identifier: { type: 'Identifier', name: 'Int' },
        list: false,
      });
      expect(cursor.position).toBe(1);
    });

    it('should parse type expression with list', () => {
      const cursor = new TokensParser(null, `Int[] = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeExpressionNode>({
        type: 'TypeExpression',
        identifier: { type: 'Identifier', name: 'Int' },
        list: true,
      });
      expect(cursor.position).toBe(3);
    });

    it('should throw on string', () => {
      const cursor = new TokensParser(null, `'Int' = 5`);

      expect(() => parseTypeNode(cursor)).toThrow(
        'Expect identifier name (line: 1, column: 1)',
      );
      expect(cursor.position).toBe(0);
    });

    it('should parse type expression with empty arguments', () => {
      const cursor = new TokensParser(null, `Int() = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeExpressionNode>({
        type: 'TypeExpression',
        identifier: { type: 'Identifier', name: 'Int' },
        list: false,
      });
      expect(cursor.position).toBe(3);
    });

    it('should parse type generator with argument', () => {
      const cursor = new TokensParser(null, `Int(foo: 1) = 5`);

      expect(parseTypeNode(cursor)).toEqual<TypeGeneratorNode>({
        type: 'TypeGenerator',
        identifier: { type: 'Identifier', name: 'Int' },
        arguments: [
          {
            type: 'Argument',
            key: { type: 'Identifier', name: 'foo' },
            value: { type: 'Literal', value: 1 },
          },
        ],
      });
      expect(cursor.position).toBe(6);
    });
  });
});
