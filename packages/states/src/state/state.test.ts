import { StatesContext } from '@/index';
import { FieldNode, parseStates, StateNode } from '@neuledge/states-parser';
import { parseStateField } from './field';
import { parseState } from './state';

/* eslint-disable max-lines-per-function */

describe('state/state', () => {
  describe('parseState()', () => {
    it('should parse state', () => {
      const doc = parseStates(`
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

      const stateNode = doc.body[0] as StateNode;
      const ctx = new StatesContext();

      const fields = {
        id: parseStateField(ctx, stateNode.fields[0] as FieldNode, 0),
        name: parseStateField(ctx, stateNode.fields[1] as FieldNode, 0),
        email: parseStateField(ctx, stateNode.fields[2] as FieldNode, 0),
      };

      const state = parseState(stateNode, fields, { bar: 2 as never }, 0);

      expect(state).toEqual({
        type: 'State',
        node: stateNode,
        name: 'User',
        description: 'The user state',
        deprecated: undefined,
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

    it('should parse state with basic decorators', () => {
      const doc = parseStates(`
                    @deprecated
                    state User {
                        @id id: Number = 1
                        name?: String = 2
                        email: String = 3
                    }
                `);

      const stateNode = doc.body[0] as StateNode;
      const ctx = new StatesContext();

      const fields = {
        id: parseStateField(ctx, stateNode.fields[0] as FieldNode, 0),
        name: parseStateField(ctx, stateNode.fields[1] as FieldNode, 0),
        email: parseStateField(ctx, stateNode.fields[2] as FieldNode, 0),
      };

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
      const doc = parseStates(`
                            @deprecated(reason: "Use UserV2")
                            @index(fields: {name: 1, id: "desc"})
                            @index(fields: ["email"], unique: true)
                            state User {
                                @id id: Number = 1
                                name?: String = 2
                                email: String = 3
                            }
                        `);

      const stateNode = doc.body[0] as StateNode;
      const ctx = new StatesContext();

      const fields = {
        id: parseStateField(ctx, stateNode.fields[0] as FieldNode, 0),
        name: parseStateField(ctx, stateNode.fields[1] as FieldNode, 0),
        email: parseStateField(ctx, stateNode.fields[2] as FieldNode, 0),
      };

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
      const doc = parseStates(`
          @index(fields: ["foo"])
          state User {
              @id id: Number = 1
              name?: String = 2
              email: String = 3
          }
      `);

      const stateNode = doc.body[0] as StateNode;
      const ctx = new StatesContext();

      const fields = {
        id: parseStateField(ctx, stateNode.fields[0] as FieldNode, 0),
        name: parseStateField(ctx, stateNode.fields[1] as FieldNode, 0),
        email: parseStateField(ctx, stateNode.fields[2] as FieldNode, 0),
      };

      expect(() =>
        parseState(stateNode, fields, { bar: 2 as never }, 0),
      ).toThrow('Field foo does not exist');
    });

    it('should throw on missing argument', () => {
      const doc = parseStates(`
          @index
          state User {
              @id id: Number = 1
              name?: String = 2
              email: String = 3
          }
      `);
      const stateNode = doc.body[0] as StateNode;
      const ctx = new StatesContext();

      const fields = {
        id: parseStateField(ctx, stateNode.fields[0] as FieldNode, 0),
        name: parseStateField(ctx, stateNode.fields[1] as FieldNode, 0),
        email: parseStateField(ctx, stateNode.fields[2] as FieldNode, 0),
      };

      expect(() =>
        parseState(stateNode, fields, { bar: 2 as never }, 0),
      ).toThrow(
        "Invalid '@index()' decorator on argument 'fields': Invalid input",
      );
    });
  });
});
