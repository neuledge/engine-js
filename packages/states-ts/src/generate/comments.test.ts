import { generateDescriptionComment } from './comments.js';

/* eslint-disable max-lines-per-function */

const pos = { start: 0, end: 0 };

describe('generate/comments', () => {
  describe('generateDescriptionComment()', () => {
    it('should not generate a comment on empty input', () => {
      expect(generateDescriptionComment({}, '')).toBe('');
      expect(generateDescriptionComment({}, '  ')).toBe('');
    });

    it('should generate a single line comment', () => {
      expect(
        generateDescriptionComment(
          {
            description: { type: 'Description', value: 'Foo bar!', ...pos },
          },
          '',
        ),
      ).toBe('/**\n * Foo bar!\n */\n');
    });

    it('should generate a single line comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: { type: 'Description', value: 'Foo bar!', ...pos },
          },
          '  ',
        ),
      ).toBe('/**\n   * Foo bar!\n   */\n  ');
    });

    it('should generate deprecated a single line comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: { type: 'Description', value: 'Foo bar!', ...pos },
            decorators: [
              {
                type: 'Decorator',
                callee: { type: 'Identifier', name: 'deprecated', ...pos },
                arguments: [
                  {
                    type: 'Argument',
                    key: { type: 'Identifier', name: 'reason', ...pos },
                    value: { type: 'Literal', value: 'my reason', ...pos },
                    ...pos,
                  },
                ],
                ...pos,
              },
            ],
          },
          '  ',
        ),
      ).toBe('/**\n   * Foo bar!\n   *\n   * @deprecated my reason\n   */\n  ');
    });

    it('should generate a multiline comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: {
              type: 'Description',
              value: 'Foo\n    bar!',
              ...pos,
            },
          },
          '  ',
        ),
      ).toBe('/**\n   * Foo\n   *     bar!\n   */\n  ');
    });

    it('should generate deprecated a multiline comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: { type: 'Description', value: 'Foo\nbar!', ...pos },
            decorators: [
              {
                type: 'Decorator',
                callee: { type: 'Identifier', name: 'deprecated', ...pos },
                arguments: [
                  {
                    type: 'Argument',
                    key: { type: 'Identifier', name: 'reason', ...pos },
                    value: { type: 'Literal', value: 'my reason', ...pos },
                    ...pos,
                  },
                ],
                ...pos,
              },
            ],
          },
          '  ',
        ),
      ).toBe(
        '/**\n   * Foo\n   * bar!\n   *\n   * @deprecated my reason\n   */\n  ',
      );
    });

    it('should generate deprecated empty comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            decorators: [
              {
                type: 'Decorator',
                callee: { type: 'Identifier', name: 'deprecated', ...pos },
                arguments: [
                  {
                    type: 'Argument',
                    key: { type: 'Identifier', name: 'reason', ...pos },
                    value: { type: 'Literal', value: 'my reason', ...pos },
                    ...pos,
                  },
                ],
                ...pos,
              },
            ],
          },
          '  ',
        ),
      ).toBe('/**\n   * @deprecated my reason\n   */\n  ');
    });

    it('should generate multiple deprecated empty comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            decorators: [
              {
                type: 'Decorator',
                callee: { type: 'Identifier', name: 'deprecated', ...pos },
                arguments: [
                  {
                    type: 'Argument',
                    key: { type: 'Identifier', name: 'reason', ...pos },
                    value: { type: 'Literal', value: 'my\nreason', ...pos },
                    ...pos,
                  },
                ],
                ...pos,
              },
            ],
          },
          '  ',
        ),
      ).toBe('/**\n   * @deprecated my\n   * reason\n   */\n  ');
    });
  });
});
