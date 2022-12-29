import { generateDescriptionComment } from './comments';

/* eslint-disable max-lines-per-function */

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
            description: 'Foo bar!',
          },
          '',
        ),
      ).toBe('/**\n * Foo bar!\n */\n');
    });

    it('should generate a single line comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: 'Foo bar!',
          },
          '  ',
        ),
      ).toBe('/**\n   * Foo bar!\n   */\n  ');
    });

    it('should generate deprecated a single line comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: 'Foo bar!',
            deprecated: 'my reason',
          },
          '  ',
        ),
      ).toBe('/**\n   * Foo bar!\n   *\n   * @deprecated my reason\n   */\n  ');
    });

    it('should generate a multiline comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: 'Foo\n    bar!',
          },
          '  ',
        ),
      ).toBe('/**\n   * Foo\n   *     bar!\n   */\n  ');
    });

    it('should generate deprecated a multiline comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            description: 'Foo\nbar!',
            deprecated: 'my reason',
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
            deprecated: 'my reason',
          },
          '  ',
        ),
      ).toBe('/**\n   * @deprecated my reason\n   */\n  ');
    });

    it('should generate multiple deprecated empty comment with intent', () => {
      expect(
        generateDescriptionComment(
          {
            deprecated: 'my\nreason',
          },
          '  ',
        ),
      ).toBe('/**\n   * @deprecated my\n   * reason\n   */\n  ');
    });
  });
});
