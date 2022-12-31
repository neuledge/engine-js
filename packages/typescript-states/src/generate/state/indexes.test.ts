import { NumberScalar, StringScalar } from '@neuledge/scalars';
import { generateStateIdType, generateStateStaticIndexes } from './indexes';

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
            fields: {
              id: 'asc',
            },
            unique: true,
          },
          indexes: [],
          mutations: {},
        }),
      ).toBe("['+id']");
    });

    it('should generate the id type with multiple fields', () => {
      expect(
        generateStateIdType({
          type: 'State',
          name: 'Test',
          node: null as never,
          fields: {},
          primaryKey: {
            fields: {
              id: 'asc',
              name: 'desc',
            },
            unique: true,
          },
          indexes: [],
          mutations: {},
        }),
      ).toBe("['+id', '-name']");
    });
  });

  describe('generateStateStaticIndexes()', () => {
    it('should generate simple static index', () => {
      expect(
        generateStateStaticIndexes(
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
                  node: null as never,
                  entity: NumberScalar,
                  list: false,
                },
                index: 1,
              },
            },
            primaryKey: null as never,
            indexes: [
              {
                fields: { id: 'asc' },
                unique: true,
              },
            ],
            mutations: {},
          },
          '  ',
        ),
      ).toMatchInlineSnapshot(`
        "static $find: $.Where<{
            id?: $.WhereNumber<Number>;
          }>;
          static $unique: {
            id: Number;
          };"
      `);
    });

    it('should generate static index with multiple fields', () => {
      expect(
        generateStateStaticIndexes(
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
                  node: null as never,
                  entity: NumberScalar,
                  list: false,
                },
                index: 1,
              },
              name: {
                type: 'ScalarField',
                name: 'name',
                node: null as never,
                as: {
                  type: 'EntityExpression',
                  node: null as never,
                  entity: StringScalar,
                  list: false,
                },
                index: 2,
              },
            },
            primaryKey: null as never,
            indexes: [
              {
                fields: { id: 'asc', name: 'desc' },
                unique: true,
              },
            ],
            mutations: {},
          },
          '  ',
        ),
      ).toMatchInlineSnapshot(`
        "static $find: $.Where<
            | {
                id?: $.WhereNumber<Number>;
              }
            | {
                id: $.WhereNumber<Number>;
                name?: $.WhereString<String>;
              }
          >;
          static $unique: {
            id: Number;
            name: String;
          };"
      `);
    });

    it('should generate multiple static indexes', () => {
      expect(
        generateStateStaticIndexes(
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
                  node: null as never,
                  entity: NumberScalar,
                  list: false,
                },
                index: 1,
              },
              name: {
                type: 'ScalarField',
                name: 'name',
                node: null as never,
                as: {
                  type: 'EntityExpression',
                  node: null as never,
                  entity: StringScalar,
                  list: false,
                },
                nullable: true,
                index: 2,
              },
            },
            primaryKey: null as never,
            indexes: [
              {
                fields: { id: 'asc' },
                unique: true,
              },
              {
                fields: { name: 'asc' },
              },
            ],
            mutations: {},
          },
          '  ',
        ),
      ).toMatchInlineSnapshot(`
        "static $find: $.Where<
            | {
                id?: $.WhereNumber<Number>;
              }
            | {
                name?: $.WhereNullableString<String>;
              }
          >;
          static $unique: {
            id: Number;
          };"
      `);
    });
  });
});
