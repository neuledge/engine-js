import { NumberScalar, StringScalar } from '@neuledge/scalars';
import { StatesContext } from '@/context';
import { FieldNode, parseStates, StateNode } from '@neuledge/states-parser';
import { parseStateFields } from './field';
import { State } from './state';

/* eslint-disable max-lines-per-function */

const generateState = (source: string) => {
  const ctx = new StatesContext();
  const doc = parseStates(source);

  const state: State = {
    type: 'State',
    node: doc.body[0] as StateNode,
    name: 'User',
    fields: {},
    primaryKey: {
      name: '',
      fields: {},
      unique: true,
    },
    indexes: {},
    mutations: {},
  };

  return { ctx, state, nodes: state.node.fields as FieldNode[] };
};

describe('state/field', () => {
  describe('parseStateFields()', () => {
    it('should parse fields', () => {
      const { ctx, state, nodes } = generateState(`
        state User {
            id: Number = 1
            name?: String = 2

            """
            The user email
            """
            email: String = 3
        }
      `);

      const fields = parseStateFields(ctx, state, nodes);

      expect(fields).toEqual({
        id: {
          type: 'ScalarField',
          node: nodes[0],
          name: 'id',
          nullable: false,
          index: 1,
          entity: NumberScalar,
        },
        name: {
          type: 'ScalarField',
          node: nodes[1],
          name: 'name',
          nullable: true,
          index: 2,
          entity: StringScalar,
        },
        email: {
          type: 'ScalarField',
          node: nodes[2],
          name: 'email',
          description: 'The user email',
          nullable: false,
          index: 3,
          entity: StringScalar,
        },
      });
    });

    it('should parse fields with simple decorators', () => {
      const { ctx, state, nodes } = generateState(`
            state User {
                @id id: Number = 1
                @deprecated name?: String = 2
                email: String = 3
            }
        `);

      const fields = parseStateFields(ctx, state, nodes);

      expect(fields).toEqual({
        id: {
          type: 'ScalarField',
          node: nodes[0],
          name: 'id',
          nullable: false,
          index: 1,
          entity: NumberScalar,
        },
        name: {
          type: 'ScalarField',
          node: nodes[1],
          name: 'name',
          nullable: true,
          deprecated: true,
          index: 2,
          entity: StringScalar,
        },
        email: {
          type: 'ScalarField',
          node: nodes[2],
          name: 'email',
          nullable: false,
          index: 3,
          entity: StringScalar,
        },
      });

      expect(state.primaryKey.fields).toEqual({
        id: 'asc',
      });

      expect(state.indexes).toEqual({});
    });

    it('should parse fields with complex decorators', () => {
      const { ctx, state, nodes } = generateState(`
                state User {
                    @id(direction: "desc") id: Number = 1
                    @deprecated(reason: "Use name instead") name?: String = 2
                    @unique email: String = 3
                }
            `);

      const fields = parseStateFields(ctx, state, nodes);

      expect(fields).toEqual({
        id: {
          type: 'ScalarField',
          node: nodes[0],
          name: 'id',
          nullable: false,
          index: 1,
          entity: NumberScalar,
        },
        name: {
          type: 'ScalarField',
          node: nodes[1],
          name: 'name',
          nullable: true,
          deprecated: 'Use name instead',
          index: 2,
          entity: StringScalar,
        },
        email: {
          type: 'ScalarField',
          node: nodes[2],
          name: 'email',
          nullable: false,
          index: 3,
          entity: StringScalar,
        },
      });

      expect(state.primaryKey.fields).toEqual({
        id: 'desc',
      });

      expect(state.indexes).toEqual({
        email: {
          name: 'email',
          fields: { email: 'asc' },
          unique: true,
        },
      });
    });

    it('should parse fields with index decorators', () => {
      const { ctx, state, nodes } = generateState(`
        state User {
          @id(direction: "desc") id: Number = 1
          @index name?: String = 2
          @index(direction: -1, unique: true) email: String = 3
        }
      `);

      const fields = parseStateFields(ctx, state, nodes);

      expect(fields).toEqual({
        id: {
          type: 'ScalarField',
          node: nodes[0],
          name: 'id',
          nullable: false,
          index: 1,
          entity: NumberScalar,
        },
        name: {
          type: 'ScalarField',
          node: nodes[1],
          name: 'name',
          nullable: true,
          index: 2,
          entity: StringScalar,
        },
        email: {
          type: 'ScalarField',
          node: nodes[2],
          name: 'email',
          nullable: false,
          index: 3,
          entity: StringScalar,
        },
      });

      expect(state.primaryKey.fields).toEqual({
        id: 'desc',
      });

      expect(state.indexes).toEqual({
        name: {
          name: 'name',
          fields: { name: 'asc' },
        },
        email: {
          name: 'email',
          fields: { email: 'desc' },
          unique: true,
        },
      });
    });

    it('should throw on invalid decorator field', () => {
      const { ctx, state, nodes } = generateState(`
            state User {
                @id id: Number = 1
                @index(unique: 3) name?: String = 2
                email: String = 3
            }
        `);

      expect(() => parseStateFields(ctx, state, nodes)).toThrow(
        "Invalid '@index()' decorator on argument 'unique': Expected boolean, received number",
      );
    });
  });
});
