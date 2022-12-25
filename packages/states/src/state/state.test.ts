import { FieldNode, parseStates, StateNode } from '@neuledge/states-parser';
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

      const state = parseState(
        doc.body[0] as StateNode,
        stateNode.fields as FieldNode[],
      );

      expect(state).toEqual({
        node: stateNode,
        name: 'User',
        description: 'The user state',
        deprecated: undefined,
        fields: {
          id: {
            node: stateNode.fields[0],
            name: 'id',
            nullable: false,
            index: 1,
          },
          name: {
            node: stateNode.fields[1],
            name: 'name',
            nullable: true,
            index: 2,
          },
          email: {
            node: stateNode.fields[2],
            name: 'email',
            description: 'The user email',
            nullable: false,
            index: 3,
          },
        },
        primaryKey: {
          fields: { id: 'asc' },
          unique: true,
        },
        indexes: [
          {
            fields: { id: 'asc' },
            unique: true,
          },
        ],
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

      const state = parseState(
        doc.body[0] as StateNode,
        stateNode.fields as FieldNode[],
      );

      expect(state).toEqual({
        node: stateNode,
        name: 'User',
        description: undefined,
        deprecated: true,
        fields: {
          id: {
            node: stateNode.fields[0],
            name: 'id',
            nullable: false,
            index: 1,
          },
          name: {
            node: stateNode.fields[1],
            name: 'name',
            nullable: true,
            index: 2,
          },
          email: {
            node: stateNode.fields[2],
            name: 'email',
            nullable: false,
            index: 3,
          },
        },
        primaryKey: {
          fields: { id: 'asc' },
          unique: true,
        },
        indexes: [
          {
            fields: { id: 'asc' },
            unique: true,
          },
        ],
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

      const state = parseState(
        doc.body[0] as StateNode,
        stateNode.fields as FieldNode[],
      );

      expect(state).toEqual({
        node: stateNode,
        name: 'User',
        description: undefined,
        deprecated: 'Use UserV2',
        fields: {
          id: {
            node: stateNode.fields[0],
            name: 'id',
            nullable: false,
            index: 1,
          },
          name: {
            node: stateNode.fields[1],
            name: 'name',
            nullable: true,
            index: 2,
          },
          email: {
            node: stateNode.fields[2],
            name: 'email',
            nullable: false,
            index: 3,
          },
        },
        primaryKey: {
          fields: { id: 'asc' },
          unique: true,
        },
        indexes: [
          {
            fields: { id: 'asc' },
            unique: true,
          },
          {
            fields: { name: 'asc', id: 'desc' },
          },
          {
            fields: { email: 'asc' },
            unique: true,
          },
        ],
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

      expect(() =>
        parseState(doc.body[0] as StateNode, stateNode.fields as FieldNode[]),
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

      expect(() =>
        parseState(doc.body[0] as StateNode, stateNode.fields as FieldNode[]),
      ).toThrow(
        "Invalid '@index()' decorator on argument 'fields': Invalid input",
      );
    });
  });
});
