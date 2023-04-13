import { StatesContext } from '@/index';
import { FieldNode, parseStates, StateNode } from '@neuledge/states-parser';
import { parseStateField } from './field';
import { parseState } from './state';

/* eslint-disable max-lines-per-function */

const parseStateNode = (body: string) => {
  const doc = parseStates(body);

  const stateNode = doc.body[0] as StateNode;
  const ctx = new StatesContext();

  const fields = Object.fromEntries(
    stateNode.fields.map((fieldNode) => {
      const field = parseStateField(ctx, fieldNode as FieldNode, 0);

      return [field.name, field];
    }),
  );

  return { stateNode, fields };
};

describe('state/state', () => {
  describe('parseState()', () => {
    it('should parse state', () => {
      const { stateNode, fields } = parseStateNode(`
        """
        The user state
        """
        state User {
          @id id: Number = 1
          name?: String = 2

          """
          The user email
          """
          email: String = 3
        }
      `);

      const state = parseState(stateNode, fields, { bar: 2 as never }, 0);

      expect(state).toEqual({
        type: 'State',
        node: stateNode,
        name: 'User',
        description: 'The user state',
        fields,
        primaryKey: {
          name: 'id',
          fields: { id: 'asc' },
          unique: true,
        },
        indexes: {
          id: {
            name: 'id',
            fields: { id: 'asc' },
            unique: true,
          },
        },
        mutations: { bar: 2 },
        baseIndex: 0,
      });
    });

    it('should throw on basic example state without primary key', () => {
      const { stateNode, fields } = parseStateNode(`
        """
        This is the category state.
        """
        state Category {
          "The category id"
          id: Integer = 1
        
          "The category name"
          name: String = 2
        }
      `);

      expect(() => parseState(stateNode, fields, {}, 0)).toThrow(
        'State "Category" must have at least one primary key field',
      );
    });

    it('should parsebasic example state with primary key', () => {
      const { stateNode, fields } = parseStateNode(`
        """
        This is the category state.
        """
        state Category {
          "The category id"
          @id id: Integer = 1

          "The category name"
          name: String = 2
        }
      `);

      const state = parseState(stateNode, fields, {}, 0);

      expect(state).toEqual({
        type: 'State',
        node: stateNode,
        name: 'Category',
        description: 'This is the category state.',
        fields,
        primaryKey: {
          name: 'id',
          fields: { id: 'asc' },
          unique: true,
        },
        indexes: {
          id: {
            name: 'id',
            fields: { id: 'asc' },
            unique: true,
          },
        },
        mutations: {},
        baseIndex: 0,
      });
    });

    it('should parse state with basic decorators', () => {
      const { stateNode, fields } = parseStateNode(`
          @deprecated
          state User {
            @id id: Number = 1
            name?: String = 2
            email: String = 3
          }
      `);

      const state = parseState(stateNode, fields, { bar: 2 as never }, 255);

      expect(state).toEqual({
        type: 'State',
        node: stateNode,
        name: 'User',
        description: undefined,
        deprecated: true,
        fields,
        primaryKey: {
          name: 'id',
          fields: { id: 'asc' },
          unique: true,
        },
        indexes: {
          id: {
            name: 'id',
            fields: { id: 'asc' },
            unique: true,
          },
        },
        mutations: { bar: 2 },
        baseIndex: 255,
      });
    });

    it('should parse state with complex decorators', () => {
      const { stateNode, fields } = parseStateNode(`
        @deprecated(reason: "Use UserV2")
        @index(fields: {name: 1, id: "desc"})
        @index(fields: ["email"], unique: true)
        state User {
          @id id: Number = 1
          name?: String = 2
          email: String = 3
        }
      `);

      const state = parseState(stateNode, fields, { bar: 2 as never }, 0);

      expect(state).toEqual({
        type: 'State',
        node: stateNode,
        name: 'User',
        description: undefined,
        deprecated: 'Use UserV2',
        fields,
        primaryKey: {
          name: 'id',
          fields: { id: 'asc' },
          unique: true,
        },
        indexes: {
          name_id: {
            name: 'name_id',
            fields: { name: 'asc', id: 'desc' },
          },
          email: {
            name: 'email',
            fields: { email: 'asc' },
            unique: true,
          },
          id: {
            name: 'id',
            fields: { id: 'asc' },
            unique: true,
          },
        },
        mutations: { bar: 2 },
        baseIndex: 0,
      });
    });

    it('should throw on invalid field name', () => {
      const { stateNode, fields } = parseStateNode(`
        @index(fields: ["foo"])
        state User {
          @id id: Number = 1
          name?: String = 2
          email: String = 3
        }
      `);

      expect(() =>
        parseState(stateNode, fields, { bar: 2 as never }, 0),
      ).toThrow('Field foo does not exist');
    });

    it('should throw on missing argument', () => {
      const { stateNode, fields } = parseStateNode(`
        @index
        state User {
          @id id: Number = 1
          name?: String = 2
          email: String = 3
        }
      `);

      expect(() =>
        parseState(stateNode, fields, { bar: 2 as never }, 0),
      ).toThrow(
        "Invalid '@index()' decorator on argument 'fields': Invalid input",
      );
    });

    it('should allow multiple primary keys', () => {
      const { stateNode, fields } = parseStateNode(`
        state User {
          @id firstName: String = 1
          @id lastName: String = 2
          email: String = 3
        }
      `);

      const state = parseState(stateNode, fields, { bar: 2 as never }, 0);

      expect(state).toEqual({
        type: 'State',
        node: stateNode,
        name: 'User',
        description: undefined,
        deprecated: undefined,
        fields,
        primaryKey: {
          name: 'firstName_lastName',
          fields: { firstName: 'asc', lastName: 'asc' },
          unique: true,
        },
        indexes: {
          firstName_lastName: {
            name: 'firstName_lastName',
            fields: { firstName: 'asc', lastName: 'asc' },
            unique: true,
          },
        },
        mutations: { bar: 2 },
        baseIndex: 0,
      });
    });

    it('should throw on nullable primary key', () => {
      const { stateNode, fields } = parseStateNode(`
        state User {
          @id id?: String = 1
        }
      `);

      expect(() =>
        parseState(stateNode, fields, { bar: 2 as never }, 0),
      ).toThrow('Primary key field "id" on state "User" cannot be nullable');
    });

    it('should throw on nullable primary keys', () => {
      const { stateNode, fields } = parseStateNode(`
        state User {
          @id firstName: String = 1
          @id lastName?: String = 2
          email: String = 3
        } 
      `);

      expect(() =>
        parseState(stateNode, fields, { bar: 2 as never }, 0),
      ).toThrow(
        'Primary key field "lastName" on state "User" cannot be nullable',
      );
    });

    it('should throw on multiple primary keys with auto increment', () => {
      const { stateNode, fields } = parseStateNode(`
        state User {
          @id(auto: "increment") id: Number = 1
          @id subId: Number = 2
          email: String = 3
        }
      `);

      expect(() =>
        parseState(stateNode, fields, { bar: 2 as never }, 0),
      ).toThrow(
        'State "User" with auto-incrementing primary key can only have one field',
      );
    });
  });
});
