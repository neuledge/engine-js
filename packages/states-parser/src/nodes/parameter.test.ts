import { TokenCursor } from '@/tokens';
import { parseParameterNodes } from './parameter';

/* eslint-disable max-lines-per-function */

describe('nodes/parameter', () => {
  describe('parseParameterNodes()', () => {
    it('should throw on missing parameters', () => {
      const cursor = new TokenCursor(`foo`);

      expect(() => parseParameterNodes(cursor)).toThrow("Expect '(' token");
    });

    it('should parse empty parameters', () => {
      const cursor = new TokenCursor(`()`);

      expect(parseParameterNodes(cursor)).toEqual([]);
    });

    it('should parse single parameter', () => {
      const cursor = new TokenCursor(`(username: Slug)`);

      expect(parseParameterNodes(cursor)).toMatchObject([
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'username' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Slug' },
          },
          nullable: false,
          description: undefined,
          decorators: [],
        },
      ]);
    });

    it('should parse single parameter with description', () => {
      const cursor = new TokenCursor(
        `(
            "Username"
            username: Slug
        )`,
      );

      expect(parseParameterNodes(cursor)).toMatchObject([
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'username' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Slug' },
          },
          nullable: false,
          description: {
            type: 'Description',
            value: 'Username',
          },
          decorators: [],
        },
      ]);
    });

    it('should parse single parameter with decorators', () => {
      const cursor = new TokenCursor(
        `(
            @required
            username: Slug
        )`,
      );

      expect(parseParameterNodes(cursor)).toMatchObject([
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'username' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Slug' },
          },
          nullable: false,
          description: undefined,
          decorators: [
            {
              type: 'Decorator',
              callee: { type: 'Identifier', name: 'required' },
              arguments: [],
            },
          ],
        },
      ]);
    });

    it('should parse optional parameter', () => {
      const cursor = new TokenCursor(`(username?: Slug)`);

      expect(parseParameterNodes(cursor)).toMatchObject([
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'username' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Slug' },
          },
          nullable: true,
          description: undefined,
          decorators: [],
        },
      ]);
    });

    it('should parse list of parameters', () => {
      const cursor = new TokenCursor(
        `(
            username: Slug
            firstName: FirstName
            lastName?: LastName
            email: Email
            manager: User[]
        )`,
      );

      expect(parseParameterNodes(cursor)).toMatchObject([
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'username' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Slug' },
          },
          nullable: false,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'firstName' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'FirstName' },
          },
          nullable: false,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'lastName' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'LastName' },
          },
          nullable: true,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'email' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Email' },
          },
          nullable: false,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'manager' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'User' },
            list: true,
          },
          nullable: false,
        },
      ]);
    });

    it('should parse list of parameters with commas', () => {
      const cursor = new TokenCursor(
        `(
            username: Slug,
            firstName: FirstName,
            lastName?: LastName,
            email: Email,
            manager: User[]
        )`,
      );

      expect(parseParameterNodes(cursor)).toMatchObject([
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'username' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Slug' },
          },
          nullable: false,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'firstName' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'FirstName' },
          },
          nullable: false,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'lastName' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'LastName' },
          },
          nullable: true,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'email' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'Email' },
          },
          nullable: false,
        },
        {
          type: 'Parameter',
          key: { type: 'Identifier', name: 'manager' },
          as: {
            type: 'TypeExpression',
            identifier: { type: 'Identifier', name: 'User' },
            list: true,
          },
          nullable: false,
        },
      ]);
    });
  });
});
