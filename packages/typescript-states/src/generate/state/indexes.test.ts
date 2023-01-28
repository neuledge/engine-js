import { NumberScalar, StringScalar } from '@neuledge/scalars';
import { generateStateIdType, generateStateQueryIndexes } from './indexes';

/* eslint-disable max-lines-per-function */

describe('generate/state/indexes', () => {
  describe('generateStateIdType()', () => {
    it('should generate the id type', () => {
      expect(
        generateStateIdType({
          type: 'State',
          name: 'Test',
          node: null as never,
          fields: {},
          primaryKey: {
            name: 'id',
            fields: {
              id: 'asc',
            },
            unique: true,
          },
          indexes: {},
          mutations: {},
          baseIndex: 0,
        }),
      ).toBe("{ fields: ['+id'] }");
    });

    it('should generate the id type with auto', () => {
      expect(
        generateStateIdType({
          type: 'State',
          name: 'Test',
          node: null as never,
          fields: {},
          primaryKey: {
            name: 'id',
            fields: {
              id: 'asc',
            },
            unique: true,
            auto: 'increment',
          },
          indexes: {},
          mutations: {},
          baseIndex: 0,
        }),
      ).toBe("{ fields: ['+id'], auto: 'increment' }");
    });

    it('should generate the id type with multiple fields', () => {
      expect(
        generateStateIdType({
          type: 'State',
          name: 'Test',
          node: null as never,
          fields: {},
          primaryKey: {
            name: 'id_name',
            fields: {
              id: 'asc',
              name: 'desc',
            },
            unique: true,
          },
          indexes: {},
          mutations: {},
          baseIndex: 0,
        }),
      ).toBe("{ fields: ['+id', '-name'] }");
    });
  });

  describe('generateStateStaticIndexes()', () => {
    it('should generate simple static index', () => {
      expect(
        generateStateQueryIndexes(
          {
            type: 'State',
            name: 'Test',
            node: null as never,
            fields: {
              id: {
                type: 'ScalarField',
                name: 'id',
                node: null as never,
                as: {
                  type: 'EntityExpression',
                  entity: NumberScalar,
                  list: false,
                  node: null as never,
                },
                index: 1,
              },
            },
            primaryKey: null as never,
            indexes: {
              id: {
                name: 'id',
                fields: { id: 'asc' },
                unique: true,
              },
            },
            mutations: {},
            baseIndex: 0,
          },
          '  ',
        ),
      ).toMatchInlineSnapshot(`
        "static $find: $.Where<{
            id?: $.WhereNumber<$.scalars.Number>;
          }>;
          static $unique: {
            id: $.scalars.Number;
          };"
      `);
    });

    it('should generate static index with multiple fields', () => {
      expect(
        generateStateQueryIndexes(
          {
            type: 'State',
            name: 'Test',
            node: null as never,
            fields: {
              id: {
                type: 'ScalarField',
                name: 'id',
                node: null as never,
                as: {
                  type: 'EntityExpression',
                  entity: NumberScalar,
                  list: false,
                  node: null as never,
                },
                index: 1,
              },
              name: {
                type: 'ScalarField',
                name: 'name',
                node: null as never,
                as: {
                  type: 'EntityExpression',
                  entity: StringScalar,
                  list: false,
                  node: null as never,
                },
                index: 2,
              },
            },
            primaryKey: null as never,
            indexes: {
              id_name: {
                name: 'id_name',
                fields: { id: 'asc', name: 'desc' },
                unique: true,
              },
            },
            mutations: {},
            baseIndex: 0,
          },
          '  ',
        ),
      ).toMatchInlineSnapshot(`
        "static $find: $.Where<
            | {
                id?: $.WhereNumber<$.scalars.Number>;
              }
            | {
                id: $.WhereNumber<$.scalars.Number>;
                name?: $.WhereString<$.scalars.String>;
              }
          >;
          static $unique: {
            id: $.scalars.Number;
            name: $.scalars.String;
          };"
      `);
    });

    it('should generate multiple static indexes', () => {
      expect(
        generateStateQueryIndexes(
          {
            type: 'State',
            name: 'Test',
            node: null as never,
            fields: {
              id: {
                type: 'ScalarField',
                name: 'id',
                node: null as never,
                as: {
                  type: 'EntityExpression',
                  entity: NumberScalar,
                  list: false,
                  node: null as never,
                },
                index: 1,
              },
              name: {
                type: 'ScalarField',
                name: 'name',
                node: null as never,
                as: {
                  type: 'EntityExpression',
                  entity: StringScalar,
                  list: false,
                  node: null as never,
                },
                nullable: true,
                index: 2,
              },
            },
            primaryKey: null as never,
            indexes: {
              id: {
                name: 'id',
                fields: { id: 'asc' },
                unique: true,
              },
              name: {
                name: 'name',
                fields: { name: 'asc' },
              },
            },
            mutations: {},
            baseIndex: 0,
          },
          '  ',
        ),
      ).toMatchInlineSnapshot(`
        "static $find: $.Where<
            | {
                id?: $.WhereNumber<$.scalars.Number>;
              }
            | {
                name?: $.WhereNullableString<$.scalars.String>;
              }
          >;
          static $unique: {
            id: $.scalars.Number;
          };"
      `);
    });
  });
});
