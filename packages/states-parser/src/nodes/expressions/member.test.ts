import { TokenCursor } from '@/tokens';
import { parseMemberExpressionNode } from './member';

/* eslint-disable max-lines-per-function */

describe('nodes/expression/member', () => {
  describe('parseMemberExpressionNode()', () => {
    it('should throw on missing path dot', () => {
      const cursor = new TokenCursor(`foo`);

      expect(() => parseMemberExpressionNode(cursor)).toThrow(
        "Expect '.' token",
      );
    });

    it('should throw on missing path identifier', () => {
      const cursor = new TokenCursor(`foo.`);

      expect(() => parseMemberExpressionNode(cursor)).toThrow(
        'Expect identifier name',
      );
    });

    it('should parse basic member expression', () => {
      const cursor = new TokenCursor(`foo.bar`);

      expect(parseMemberExpressionNode(cursor)).toMatchObject({
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'foo',
        },
        property: {
          type: 'Identifier',
          name: 'bar',
        },
      });
    });

    it('should parse member expression with multiple properties', () => {
      const cursor = new TokenCursor(`foo.bar.baz`);

      expect(parseMemberExpressionNode(cursor)).toMatchObject({
        type: 'MemberExpression',
        object: {
          type: 'MemberExpression',
          object: {
            type: 'Identifier',
            name: 'foo',
          },
          property: {
            type: 'Identifier',
            name: 'bar',
          },
        },
        property: {
          type: 'Identifier',
          name: 'baz',
        },
      });
    });

    it('should parse member expression with this expression', () => {
      const cursor = new TokenCursor(`this.foo`);

      expect(parseMemberExpressionNode(cursor)).toMatchObject({
        type: 'MemberExpression',
        object: {
          type: 'ThisExpression',
          name: 'this',
        },
        property: {
          type: 'Identifier',
          name: 'foo',
        },
      });
    });

    it('should throw on member expression with null literal', () => {
      const cursor = new TokenCursor(`null.foo`);

      expect(() => parseMemberExpressionNode(cursor)).toThrow(
        'Unexpected null literal',
      );
    });

    it('should parse on member expression with null property', () => {
      const cursor = new TokenCursor(`foo.null`);

      expect(parseMemberExpressionNode(cursor)).toMatchObject({
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'foo',
        },
        property: {
          type: 'Identifier',
          name: 'null',
        },
      });
    });

    // eslint-disable-next-line jest/no-commented-out-tests
    //     it('should parse member expression with computed property', () => {
    //       const cursor = new Tokenizer(`foo["bar"]`);
    //
    //       expect(parseMemberExpressionNode(cursor)).toMatchObject({
    //         type: 'MemberExpression',
    //         object: {
    //           type: 'Identifier',
    //           name: 'foo',
    //         },
    //         property: {
    //           type: 'Identifier',
    //           name: 'bar',
    //         },
    //       });
    //     });

    // eslint-disable-next-line jest/no-commented-out-tests
    //     it('should parse member expression with computed property and multiple properties', () => {
    //       const cursor = new Tokenizer(`foo["bar"].baz`);
    //
    //       expect(parseMemberExpressionNode(cursor)).toMatchObject({
    //         type: 'MemberExpression',
    //         object: {
    //           type: 'MemberExpression',
    //           object: {
    //             type: 'Identifier',
    //             name: 'foo',
    //           },
    //           property: {
    //             type: 'Identifier',
    //             name: 'bar',
    //           },
    //         },
    //         property: {
    //           type: 'Identifier',
    //           name: 'baz',
    //         },
    //       });
    //     });
  });
});
