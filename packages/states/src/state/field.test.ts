import { FieldNode, parseStates, StateNode } from '@neuledge/states-parser';
import { parseStateFields } from './field';
import { State } from './state';

/* eslint-disable max-lines-per-function */

describe('state/field', () => {
  describe('parseStateFields()', () => {
    it('should parse fields', () => {
      const doc = parseStates(`
        state User {
            id: Number = 1
            name?: String = 2

            """
            The user email
            """
            email: String = 3
        }
      `);

      const state: State = {
        node: doc.body[0] as StateNode,
        name: 'User',
        fields: {},
        primaryKey: {
          fields: {},
          unique: true,
        },
        indexes: [],
      };

      const fields = parseStateFields(state, state.node.fields as FieldNode[]);

      expect(fields).toEqual({
        id: {
          node: state.node.fields[0],
          name: 'id',
          nullable: false,
          index: 1,
        },
        name: {
          node: state.node.fields[1],
          name: 'name',
          nullable: true,
          index: 2,
        },
        email: {
          node: state.node.fields[2],
          name: 'email',
          description: 'The user email',
          nullable: false,
          index: 3,
        },
      });
    });

    it('should parse fields with simple decorators', () => {
      const doc = parseStates(`
            state User {
                @id id: Number = 1
                @deprecated name?: String = 2
                email: String = 3
            }
        `);

      const state: State = {
        node: doc.body[0] as StateNode,
        name: 'User',
        fields: {},
        primaryKey: {
          fields: {},
          unique: true,
        },
        indexes: [],
      };

      const fields = parseStateFields(state, state.node.fields as FieldNode[]);

      expect(fields).toEqual({
        id: {
          node: state.node.fields[0],
          name: 'id',
          nullable: false,
          index: 1,
        },
        name: {
          node: state.node.fields[1],
          name: 'name',
          nullable: true,
          deprecated: true,
          index: 2,
        },
        email: {
          node: state.node.fields[2],
          name: 'email',
          nullable: false,
          index: 3,
        },
      });

      expect(state.primaryKey.fields).toEqual({
        id: 'asc',
      });

      expect(state.indexes).toEqual([]);
    });

    it('should parse fields with complex decorators', () => {
      const doc = parseStates(`
                state User {
                    @id(direction: "desc") id: Number = 1
                    @deprecated(reason: "Use name instead") name?: String = 2
                    @unique email: String = 3
                }
            `);

      const state: State = {
        node: doc.body[0] as StateNode,
        name: 'User',
        fields: {},
        primaryKey: {
          fields: {},
          unique: true,
        },
        indexes: [],
      };

      const fields = parseStateFields(state, state.node.fields as FieldNode[]);

      expect(fields).toEqual({
        id: {
          node: state.node.fields[0],
          name: 'id',
          nullable: false,
          index: 1,
        },
        name: {
          node: state.node.fields[1],
          name: 'name',
          nullable: true,
          deprecated: 'Use name instead',
          index: 2,
        },
        email: {
          node: state.node.fields[2],
          name: 'email',
          nullable: false,
          index: 3,
        },
      });

      expect(state.primaryKey.fields).toEqual({
        id: 'desc',
      });

      expect(state.indexes).toEqual([
        {
          fields: { email: 'asc' },
          unique: true,
        },
      ]);
    });

    it('should parse fields with index decorators', () => {
      const doc = parseStates(`
        state User {
          @id(direction: "desc") id: Number = 1
          @index name?: String = 2
          @index(direction: -1, unique: true) email: String = 3
        }
      `);

      const state: State = {
        node: doc.body[0] as StateNode,
        name: 'User',
        fields: {},
        primaryKey: {
          fields: {},
          unique: true,
        },
        indexes: [],
      };

      const fields = parseStateFields(state, state.node.fields as FieldNode[]);

      expect(fields).toEqual({
        id: {
          node: state.node.fields[0],
          name: 'id',
          nullable: false,
          index: 1,
        },
        name: {
          node: state.node.fields[1],
          name: 'name',
          nullable: true,
          index: 2,
        },
        email: {
          node: state.node.fields[2],
          name: 'email',
          nullable: false,
          index: 3,
        },
      });

      expect(state.primaryKey.fields).toEqual({
        id: 'desc',
      });

      expect(state.indexes).toEqual([
        {
          fields: { name: 'asc' },
        },
        {
          fields: { email: 'desc' },
          unique: true,
        },
      ]);
    });

    it('should throw on invalid decorator field', () => {
      const doc = parseStates(`
            state User {
                @id id: Number = 1
                @index(unique: 3) name?: String = 2
                email: String = 3
            }
        `);

      const state: State = {
        node: doc.body[0] as StateNode,
        name: 'User',
        fields: {},
        primaryKey: {
          fields: {},
          unique: true,
        },
        indexes: [],
      };

      expect(() =>
        parseStateFields(state, state.node.fields as FieldNode[]),
      ).toThrow(
        "Invalid '@index()' decorator on argument 'unique': Expected boolean, received number",
      );
    });
  });
});
