import { TokenCursor } from '@/tokens';
import { parseReturnBodyNodes } from './property';

/* eslint-disable max-lines-per-function */

describe('nodes/property', () => {
  describe('parseReturnBodyNodes()', () => {
    it('should throw on missing body', () => {
      const cursor = new TokenCursor(`foo`);

      expect(() => parseReturnBodyNodes(cursor)).toThrow("Expect '{' token");
    });

    it('should parse empty body', () => {
      const cursor = new TokenCursor(`{}`);

      expect(parseReturnBodyNodes(cursor)).toEqual([]);
    });

    it('should parse basic body', () => {
      const cursor = new TokenCursor(
        `{
            id: GeneratedID(state: this),
            email,
            normlizedEmail: NormalizedEmail(email),
            passwordHash: null,
        }`,
      );

      expect(parseReturnBodyNodes(cursor)).toMatchObject([
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'id' },
          value: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'GeneratedID' },
            arguments: [
              {
                type: 'Argument',
                key: { type: 'Identifier', name: 'state' },
                value: { type: 'ThisExpression' },
              },
            ],
          },
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'email' },
          value: { type: 'Identifier', name: 'email' },
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'normlizedEmail' },
          value: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'NormalizedEmail' },
            arguments: [
              {
                type: 'Argument',
                key: { type: 'Identifier', name: 'email' },
                value: { type: 'Identifier', name: 'email' },
              },
            ],
          },
        },
        {
          type: 'Property',
          key: { type: 'Identifier', name: 'passwordHash' },
          value: { type: 'NullLiteral' },
        },
      ]);
    });
  });
});
