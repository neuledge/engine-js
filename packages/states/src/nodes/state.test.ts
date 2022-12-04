import { Tokenizer } from '@/tokenizer';
import { parseStateNode, StateNode } from './state';

/* eslint-disable max-lines-per-function */

describe('ast/state', () => {
  describe('parseStateNode()', () => {
    it('should throw on missing state body', () => {
      const cursor = new Tokenizer(`state FreeAccount`);

      expect(() => parseStateNode(cursor)).toThrow("Expect '{' token");
    });

    it('should parse empty state', () => {
      const cursor = new Tokenizer(
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
      const cursor = new Tokenizer(
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
      const cursor = new Tokenizer(`state PaidAccount from FreeAccount {}`);

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
      const cursor = new Tokenizer(
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
      const cursor = new Tokenizer(
        `
        @demo
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      expect(parseStateNode(cursor)).toMatchObject({
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
      const cursor = new Tokenizer(
        `
        @foo
        @bar
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      expect(parseStateNode(cursor)).toMatchObject({
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
      const cursor = new Tokenizer(
        `
        """
        hi there!
        """
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      expect(parseStateNode(cursor)).toMatchObject({
        description: {
          type: 'Description',
          value: 'hi there!',
        },
        start: 51,
        end: 114,
      });
    });

    it('should parse state with description and decorators', () => {
      const cursor = new Tokenizer(
        `
        "hi there!"
        @foo
        state FreeAccount {
          id: PositiveInteger = 1
        }`,
      );

      expect(parseStateNode(cursor)).toMatchObject({
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
