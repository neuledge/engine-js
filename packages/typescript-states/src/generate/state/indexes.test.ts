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
                entity: NumberScalar,
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
            id?: $.WhereNumber<$.scalars.Number>;
          }>;
          static $unique: {
            id: $.scalars.Number;
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
                entity: NumberScalar,
                index: 1,
              },
              name: {
                type: 'ScalarField',
                name: 'name',
                node: null as never,
                entity: StringScalar,
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
                entity: NumberScalar,
                index: 1,
              },
              name: {
                type: 'ScalarField',
                name: 'name',
                node: null as never,
                entity: StringScalar,
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
