import { TokenCursor } from '@/tokens';
import { parseDecoratorNodes } from './decorator';
import { parseMaybeDescriptionNode } from './description';
import { parseStateNode, StateNode } from './state';

/* eslint-disable max-lines-per-function */

describe('nodes/state', () => {
  describe('parseStateNode()', () => {
    it('should throw on missing state body', () => {
      const cursor = new TokenCursor(`state FreeAccount`);

      expect(() => parseStateNode(cursor)).toThrow("Expect '{' token");
    });

    it('should parse empty state', () => {
      const cursor = new TokenCursor(
        `
        state FreeAccount {}`,
      );

      expect(parseStateNode(cursor)).toEqual<StateNode>({
        type: 'State',
        description: undefined,
        decorators: [],
        id: {
          type: 'Identifier',
          name: 'FreeAccount',
          start: 15,
          end: 26,
        },
        from: undefined,
        start: 9,
        end: 29,
        fields: [],
      });
    });

    it('should parse basic state', () => {
      const cursor = new TokenCursor(
        `
        state FreeAccount {
            id: PositiveInteger = 1
        }`,
      );

      expect(parseStateNode(cursor)).toMatchObject({
        fields: [
          {
            type: 'Field',
            key: {
              type: 'Identifier',
              name: 'id',
            },
          },
        ],
      });
    });

    it('should parse extended state', () => {
      const cursor = new TokenCursor(`state PaidAccount from FreeAccount {}`);

      expect(parseStateNode(cursor)).toMatchObject({
        id: {
          type: 'Identifier',
          name: 'PaidAccount',
        },
        from: {
          type: 'Identifier',
          name: 'FreeAccount',
        },
      });
    });

    it('should parse extended state with fields', () => {
      const cursor = new TokenCursor(
        `state PaidAccount from FreeAccount {
          plan: FreePlan = 1 
        }`,
      );

      expect(parseStateNode(cursor)).toMatchObject({
        id: {
          type: 'Identifier',
          name: 'PaidAccount',
        },
        from: {
          type: 'Identifier',
          name: 'FreeAccount',
        },
        fields: [
          {
            type: 'Field',
            key: {
              type: 'Identifier',
              name: 'plan',
            },
          },
        ],
      });
    });

    it('should parse state with decorator', () => {
      const cursor = new TokenCursor(
        `
        @demo
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      const decorators = parseDecoratorNodes(cursor);

      expect(parseStateNode(cursor, undefined, decorators)).toMatchObject({
        decorators: [
          {
            type: 'Decorator',
            callee: { type: 'Identifier', name: 'demo' },
          },
        ],
        start: 23,
        end: 86,
      });
    });

    it('should parse state with decorators', () => {
      const cursor = new TokenCursor(
        `
        @foo
        @bar
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      const decorators = parseDecoratorNodes(cursor);

      expect(parseStateNode(cursor, undefined, decorators)).toMatchObject({
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
        start: 35,
        end: 98,
      });
    });

    it('should parse state with description', () => {
      const cursor = new TokenCursor(
        `
        """
        hi there!
        """
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      const description = parseMaybeDescriptionNode(cursor);

      expect(parseStateNode(cursor, description)).toMatchObject({
        description: {
          type: 'Description',
          value: 'hi there!',
        },
        start: 51,
        end: 114,
      });
    });

    it('should parse state with description and decorators', () => {
      const cursor = new TokenCursor(
        `
        "hi there!"
        @foo
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      const description = parseMaybeDescriptionNode(cursor);
      const decorators = parseDecoratorNodes(cursor);

      expect(parseStateNode(cursor, description, decorators)).toMatchObject({
        description: {
          type: 'Description',
          value: 'hi there!',
        },
        decorators: [
          {
            type: 'Decorator',
            callee: { type: 'Identifier', name: 'foo' },
          },
        ],
        start: 42,
        end: 105,
      });
    });
  });
});
