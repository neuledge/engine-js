import { Tokenizer } from '@/tokenizer';
import { parseDecoratorNodes } from './decorator';
import { parseMaybeDescriptionNode } from './description';
import { parseMutationNode } from './mutation';

/* eslint-disable max-lines-per-function */

describe('nodes/mutation', () => {
  describe('parseMutationNode()', () => {
    it('should throw on missing parameters', () => {
      const cursor = new Tokenizer(`foo`);

      expect(() => parseMutationNode(cursor)).toThrow("Expect '(' token");
    });

    it('should parse basic state transform', () => {
      const cursor = new Tokenizer(
        `
        ActiveUser.suspend(): SuspendedUser => {}`,
      );

      expect(parseMutationNode(cursor)).toMatchObject({
        type: 'Mutation',
        key: {
          type: 'Identifier',
          name: 'suspend',
        },
        parameters: [],
        returns: {
          type: 'Identifier',
          name: 'SuspendedUser',
        },
        from: {
          type: 'Identifier',
          name: 'ActiveUser',
        },
        body: [],
      });
    });

    it('should parse empty state transform', () => {
      const cursor = new Tokenizer(
        `
        ActiveUser.suspend(): SuspendedUser`,
      );

      expect(parseMutationNode(cursor)).toMatchObject({
        type: 'Mutation',
        key: {
          type: 'Identifier',
          name: 'suspend',
        },
        parameters: [],
        returns: {
          type: 'Identifier',
          name: 'SuspendedUser',
        },
        from: {
          type: 'Identifier',
          name: 'ActiveUser',
        },
        body: [],
      });
    });

    it('should parse state init with parameters', () => {
      const cursor = new Tokenizer(
        `
            create(email: Email): CreatedUser => {
                email,
                createdAt: DateTime(),
            }`,
      );

      expect(parseMutationNode(cursor)).toMatchObject({
        type: 'Mutation',
        key: {
          type: 'Identifier',
          name: 'create',
        },
        parameters: [
          {
            type: 'Parameter',
            key: {
              type: 'Identifier',
              name: 'email',
            },
            parameterType: {
              type: 'TypeExpression',
              identifier: {
                type: 'Identifier',
                name: 'Email',
              },
              list: false,
            },
          },
        ],
        returns: {
          type: 'Identifier',
          name: 'CreatedUser',
        },
        from: undefined,
        body: [
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'email',
            },
            value: {
              type: 'Identifier',
              name: 'email',
            },
          },
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'createdAt',
            },
            value: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'DateTime',
              },
              arguments: [],
            },
          },
        ],
      });
    });

    it('should parse state transform with body', () => {
      const cursor = new Tokenizer(
        `
            ActiveUser.suspend(): SuspendedUser => {
              suspendedAt: DateTime()
            }`,
      );

      expect(parseMutationNode(cursor)).toMatchObject({
        type: 'Mutation',
        key: {
          type: 'Identifier',
          name: 'suspend',
        },
        parameters: [],
        returns: {
          type: 'Identifier',
          name: 'SuspendedUser',
        },
        from: {
          type: 'Identifier',
          name: 'ActiveUser',
        },
        body: [
          {
            type: 'Property',
            key: {
              type: 'Identifier',
              name: 'suspendedAt',
            },
            value: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'DateTime',
              },
              arguments: [],
            },
          },
        ],
      });
    });

    it('should parse state transform with parameters', () => {
      const cursor = new Tokenizer(
        `
            ActiveUser.suspend(reason: String): SuspendedUser => {}
        `,
      );

      expect(parseMutationNode(cursor)).toMatchObject({
        type: 'Mutation',
        key: {
          type: 'Identifier',
          name: 'suspend',
        },
        parameters: [
          {
            type: 'Parameter',
            key: {
              type: 'Identifier',
              name: 'reason',
            },
            parameterType: {
              type: 'TypeExpression',
              identifier: {
                type: 'Identifier',
                name: 'String',
              },
              list: false,
            },
          },
        ],
        returns: {
          type: 'Identifier',
          name: 'SuspendedUser',
        },
        from: {
          type: 'Identifier',
          name: 'ActiveUser',
        },
        body: [],
      });
    });

    it('should parse state transform with description', () => {
      const cursor = new Tokenizer(
        `
            """
            Suspend the user
            """
            ActiveUser.suspend(): SuspendedUser => {}`,
      );

      const description = parseMaybeDescriptionNode(cursor);

      expect(parseMutationNode(cursor, description)).toMatchObject({
        type: 'Mutation',
        key: {
          type: 'Identifier',
          name: 'suspend',
        },
        parameters: [],
        returns: {
          type: 'Identifier',
          name: 'SuspendedUser',
        },
        from: {
          type: 'Identifier',
          name: 'ActiveUser',
        },
        body: [],
        description: {
          type: 'Description',
          value: 'Suspend the user',
        },
      });
    });

    it('should parse state transform with decorators', () => {
      const cursor = new Tokenizer(
        `
            @auth
            ActiveUser.suspend(): SuspendedUser => {}`,
      );

      const decorators = parseDecoratorNodes(cursor);

      expect(parseMutationNode(cursor, undefined, decorators)).toMatchObject({
        type: 'Mutation',
        key: {
          type: 'Identifier',
          name: 'suspend',
        },
        parameters: [],
        returns: {
          type: 'Identifier',
          name: 'SuspendedUser',
        },
        from: {
          type: 'Identifier',
          name: 'ActiveUser',
        },
        body: [],
        decorators: [
          {
            type: 'Decorator',
            callee: {
              type: 'Identifier',
              name: 'auth',
            },
            arguments: [],
          },
        ],
      });
    });
  });
});
