import { Tokenizer } from '@/tokenizer';
import { parseDecoratorNodes } from './decorator';
import { parseMaybeDescriptionNode } from './description';
import { parseEitherNode } from './either';

/* eslint-disable max-lines-per-function */

describe('nodes/either', () => {
  describe('parseEitherNode()', () => {
    it('should throw on missing either body', () => {
      const cursor = new Tokenizer(`either Foo`);

      expect(() => parseEitherNode(cursor)).toThrow("Expect '=' token");
    });

    it('should not parse empty either', () => {
      const cursor = new Tokenizer(
        `
        either Foo =`,
      );

      expect(() => parseEitherNode(cursor)).toThrow('Expect identifier name');
    });

    it('should parse basic either', () => {
      const cursor = new Tokenizer(
        `
        either Foo = Bar | Baz`,
      );

      expect(parseEitherNode(cursor)).toMatchObject({
        type: 'Either',
        id: {
          type: 'Identifier',
          name: 'Foo',
        },
        states: [
          {
            type: 'Identifier',
            name: 'Bar',
          },
          {
            type: 'Identifier',
            name: 'Baz',
          },
        ],
      });
    });

    it('should parse either with single state', () => {
      const cursor = new Tokenizer(
        `
        either Foo = Bar`,
      );

      expect(parseEitherNode(cursor)).toMatchObject({
        type: 'Either',
        id: {
          type: 'Identifier',
          name: 'Foo',
        },
        states: [
          {
            type: 'Identifier',
            name: 'Bar',
          },
        ],
      });
    });

    it('should parse either with decorator', () => {
      const cursor = new Tokenizer(
        `
        @demo
        either Foo = Bar | Baz`,
      );

      const decorators = parseDecoratorNodes(cursor);

      expect(parseEitherNode(cursor, undefined, decorators)).toMatchObject({
        decorators: [
          {
            type: 'Decorator',
            callee: { type: 'Identifier', name: 'demo' },
          },
        ],
      });
    });

    it('should parse either with description', () => {
      const cursor = new Tokenizer(
        `
        """
        hi there!
        """
        either Foo = Bar | Baz`,
      );

      const description = parseMaybeDescriptionNode(cursor);

      expect(parseEitherNode(cursor, description)).toMatchObject({
        description: {
          type: 'Description',
          value: 'hi there!',
        },
      });
    });

    it('should parse either with description and decorators', () => {
      const cursor = new Tokenizer(
        `
        "hi there!"
        @foo
        either Foo = Bar | Baz`,
      );

      const description = parseMaybeDescriptionNode(cursor);
      const decorators = parseDecoratorNodes(cursor);

      expect(parseEitherNode(cursor, description, decorators)).toMatchObject({
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
      });
    });
  });
});
