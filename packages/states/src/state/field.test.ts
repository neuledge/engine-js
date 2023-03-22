import { NumberScalar, StringScalar } from '@neuledge/scalars';
import { StatesContext } from '@/context';
import { FieldNode, parseStates, StateNode } from '@neuledge/states-parser';
import { parseStateField } from './field';

/* eslint-disable max-lines-per-function */

const generateState = (source: string) => {
  const ctx = new StatesContext();
  ctx['entityMap']['Foo'] = {
    type: 'State',
    name: 'Foo',
    fields: {},
  } as never;

  const doc = parseStates(source);
  const state = doc.body[0] as StateNode;

  return { ctx, nodes: state.fields as FieldNode[] };
};

describe('state/field', () => {
  describe('parseStateField()', () => {
    it('should parse fields', () => {
      const { ctx, nodes } = generateState(`
        state User {
            id: Number = 1
            name?: String = 2

            """
            The user email
            """
            email: String = 3
        }
      `);

      expect(parseStateField(ctx, nodes[0], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[0],
        name: 'id',
        nullable: false,
        index: 1,
        as: {
          type: 'EntityExpression',
          entity: NumberScalar,
          list: false,
        },
      });

      expect(parseStateField(ctx, nodes[1], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[1],
        name: 'name',
        nullable: true,
        index: 2,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
      });

      expect(parseStateField(ctx, nodes[2], 255)).toMatchObject({
        type: 'ScalarField',
        node: nodes[2],
        name: 'email',
        description: 'The user email',
        nullable: false,
        index: 3 + 255,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
      });
    });

    it('should parse fields with simple decorators', () => {
      const { ctx, nodes } = generateState(`
            state User {
                @id id: Number = 1
                @deprecated name?: String = 2
                email: String = 3
            }
        `);

      expect(parseStateField(ctx, nodes[0], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[0],
        name: 'id',
        nullable: false,
        index: 1,
        as: {
          type: 'EntityExpression',
          entity: NumberScalar,
          list: false,
        },
        primaryKey: {
          name: 'id',
          fields: { id: 'asc' },
          unique: true,
        },
      });

      expect(parseStateField(ctx, nodes[1], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[1],
        name: 'name',
        nullable: true,
        deprecated: true,
        index: 2,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
      });

      expect(parseStateField(ctx, nodes[2], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[2],
        name: 'email',
        nullable: false,
        index: 3,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
      });
    });

    it('should parse fields with complex decorators', () => {
      const { ctx, nodes } = generateState(`
                state User {
                    @id(sort: "desc", auto: "increment") id: Number = 1
                    @deprecated(reason: "Use name instead") name?: String = 2
                    @unique email: String = 3
                }
            `);

      expect(parseStateField(ctx, nodes[0], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[0],
        name: 'id',
        nullable: false,
        index: 1,
        as: {
          type: 'EntityExpression',
          entity: NumberScalar,
          list: false,
        },
        primaryKey: {
          name: 'id',
          fields: { id: 'desc' },
          unique: true,
          auto: 'increment',
        },
      });

      expect(parseStateField(ctx, nodes[1], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[1],
        name: 'name',
        nullable: true,
        deprecated: 'Use name instead',
        index: 2,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
      });

      expect(parseStateField(ctx, nodes[2], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[2],
        name: 'email',
        nullable: false,
        index: 3,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
        sortingIndex: {
          name: 'email',
          fields: { email: 'asc' },
          unique: true,
        },
      });
    });

    it('should parse fields with index decorators', () => {
      const { ctx, nodes } = generateState(`
        state User {
          @id(sort: "desc") id: Number = 1
          @index name?: String = 2
          @index(sort: -1, unique: true) email: String = 3
        }
      `);

      expect(parseStateField(ctx, nodes[0], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[0],
        name: 'id',
        nullable: false,
        index: 1,
        as: {
          type: 'EntityExpression',
          entity: NumberScalar,
          list: false,
        },
        primaryKey: {
          name: 'id',
          fields: { id: 'desc' },
          unique: true,
        },
      });

      expect(parseStateField(ctx, nodes[1], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[1],
        name: 'name',
        nullable: true,
        index: 2,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
        sortingIndex: {
          name: 'name',
          fields: { name: 'asc' },
        },
      });

      expect(parseStateField(ctx, nodes[2], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[2],
        name: 'email',
        nullable: false,
        index: 3,
        as: {
          type: 'EntityExpression',
          entity: StringScalar,
          list: false,
        },
        sortingIndex: {
          name: 'email',
          fields: { email: 'desc' },
          unique: true,
        },
      });
    });

    it('should throw on invalid decorator field', () => {
      const { ctx, nodes } = generateState(`
            state User {
                @id id: Number = 1
                @index(unique: 3) name?: String = 2
                email: String = 3
            }
        `);

      expect(() => parseStateField(ctx, nodes[1], 0)).toThrow(
        "Invalid '@index()' decorator on argument 'unique': Expected boolean, received number",
      );
    });

    it('should generate scalar field for direct relation', () => {
      const { ctx, nodes } = generateState(`
            state User {
                @id id: Number = 1
                name?: String = 2
                email: String = 3
                creator: Foo = 4
            }
        `);

      expect(parseStateField(ctx, nodes[3], 0)).toMatchObject({
        type: 'ScalarField',
        node: nodes[3],
        name: 'creator',
        nullable: false,
        index: 4,
        as: {
          type: 'EntityExpression',
          entity: ctx.entity('Foo'),
          list: false,
        },
      });
    });

    it('should generate relation field for @reference annotation', () => {
      const { ctx, nodes } = generateState(`
            state User {
                @id id: Number = 1
                name?: String = 2
                email: String = 3
                test?: User = 4
                @reference(field: 'test') admin?: Foo = 5
            }
        `);

      expect(parseStateField(ctx, nodes[4], 0)).toMatchObject({
        type: 'RelationField',
        node: nodes[4],
        name: 'admin',
        nullable: true,
        index: 5,
        as: {
          type: 'EntityExpression',
          entity: ctx.entity('Foo'),
          list: false,
        },
        referenceField: 'test',
      });
    });

    it('should throw on missing @reference annotation', () => {
      const { ctx, nodes } = generateState(`
            state User {
                @id id: Number = 1
                name?: String = 2
                email: String = 3
                managers: Foo[] = 4
            }
        `);

      expect(() => parseStateField(ctx, nodes[3], 0)).toThrow(
        "Relation field 'managers' must have a '@reference()' field annotation",
      );
    });

    it('should throw on invalid @reference annotation', () => {
      const { ctx, nodes } = generateState(`
            state User {
                @id id: Number = 1
                name?: String = 2
                email: String = 3
                @reference(field: 3) managers: Foo[] = 4
            }
        `);

      expect(() => parseStateField(ctx, nodes[3], 0)).toThrow(
        "Invalid '@reference()' decorator on argument 'field': Expected string, received number",
      );
    });

    it('should generate foreign key field for @reference annotation', () => {
      const { ctx, nodes } = generateState(`
            state User {
                @id id: Number = 1
                name?: String = 2
                email: String = 3
                creator?: Foo = 4
                @reference(field: 'creator') childUsers: Foo[] = 5
            }
        `);

      expect(parseStateField(ctx, nodes[4], 0)).toMatchObject({
        type: 'RelationField',
        node: nodes[4],
        name: 'childUsers',
        nullable: false,
        index: 5,
        as: {
          type: 'EntityExpression',
          entity: ctx.entity('Foo'),
          list: true,
        },
        referenceField: 'creator',
      });
    });
  });
});
