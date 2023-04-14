import { PostgreSQLStore } from './store';

/* eslint-disable max-lines-per-function */

describe('store', () => {
  describe('PostgreSQLStore()', () => {
    describe('.constructor()', () => {
      it('should be able to create a new store', () => {
        const store = new PostgreSQLStore({
          client: {} as never,
        });

        expect(store).toBeInstanceOf(PostgreSQLStore);
      });
    });

    describe('.close()', () => {
      it('should be able to close the store', async () => {
        const end = jest.fn();

        const store = new PostgreSQLStore({
          client: { end } as never,
        });

        expect(store).toBeInstanceOf(PostgreSQLStore);
        expect(end).toHaveBeenCalledTimes(0);

        await store.close();
        expect(end).toHaveBeenCalledTimes(1);
      });
    });

    let store: PostgreSQLStore;
    let query: jest.Mock;

    beforeEach(() => {
      query = jest.fn();

      store = new PostgreSQLStore({
        client: { query } as never,
      });
    });

    describe('.listCollections()', () => {
      it('should be able to list collections', async () => {
        query.mockResolvedValueOnce({
          rows: [{ table_name: 'foo' }, { table_name: 'bar' }],
        });

        const collections = await store.listCollections();

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          `SELECT table_name 
    FROM information_schema.tables 
    WHERE table_catalog = current_database() AND table_schema = current_schema() AND table_type = 'BASE TABLE'`,
          undefined,
        );

        expect(collections).toEqual([{ name: 'foo' }, { name: 'bar' }]);
      });
    });

    describe('.describeCollection()', () => {
      it('should be able to describe a collection', async () => {
        query.mockResolvedValueOnce({
          rows: [
            {
              column_name: 'id',
              data_type: 'integer',
              character_maximum_length: null,
              numeric_precision: 32,
              numeric_scale: 0,
              is_nullable: false,
              is_auto_increment: true,
            },
            {
              column_name: 'name',
              data_type: 'character varying',
              character_maximum_length: 50,
              numeric_precision: null,
              numeric_scale: null,
              is_nullable: true,
              is_auto_increment: null,
            },
            {
              column_name: 'email',
              data_type: 'character varying',
              character_maximum_length: 100,
              numeric_precision: null,
              numeric_scale: null,
              is_nullable: false,
              is_auto_increment: null,
            },
            {
              column_name: 'phone',
              data_type: 'character varying',
              character_maximum_length: 20,
              numeric_precision: null,
              numeric_scale: null,
              is_nullable: true,
              is_auto_increment: null,
            },
            {
              column_name: 'created_at',
              data_type: 'timestamp without time zone',
              character_maximum_length: null,
              numeric_precision: null,
              numeric_scale: null,
              is_nullable: false,
              is_auto_increment: null,
            },
            {
              column_name: 'updated_at',
              data_type: 'timestamp without time zone',
              character_maximum_length: null,
              numeric_precision: null,
              numeric_scale: null,
              is_nullable: false,
              is_auto_increment: null,
            },
          ],
        });

        query.mockResolvedValueOnce({
          rows: [
            {
              index_name: 'idx_email',
              column_name: 'email',
              seq_in_index: 1,
              direction: 'ASC',
              nulls: 'LAST',
              is_unique: true,
              is_primary: false,
            },
            {
              index_name: 'idx_phone_email',
              column_name: 'phone',
              seq_in_index: 1,
              direction: 'DESC',
              nulls: 'FIRST',
              is_unique: false,
              is_primary: false,
            },
            {
              index_name: 'idx_phone_email',
              column_name: 'email',
              seq_in_index: 2,
              direction: 'ASC',
              nulls: 'LAST',
              is_unique: false,
              is_primary: false,
            },
            {
              index_name: 'foo_pkey',
              column_name: 'id',
              seq_in_index: 1,
              direction: 'ASC',
              nulls: 'LAST',
              is_unique: true,
              is_primary: true,
            },
          ],
        });

        const collection = await store.describeCollection({
          collection: { name: 'foo' },
        });

        expect(query).toHaveBeenCalledTimes(2);
        expect(query).toHaveBeenNthCalledWith(
          1,
          `SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, (is_nullable = 'YES') as is_nullable, column_default LIKE 'nextval(%)' AS is_auto_increment
    FROM information_schema.columns
    WHERE table_catalog = current_database() AND table_schema = current_schema() AND table_name = ?`,
          ['foo'],
        );
        expect(query).toHaveBeenNthCalledWith(
          2,
          `SELECT
      irel.relname AS index_name,
      a.attname AS column_name,
      c.ordinality as seq_in_index,
      CASE o.option & 1 WHEN 1 THEN 'DESC' ELSE 'ASC' END AS direction,
      CASE o.option & 2 WHEN 2 THEN 'FIRST' ELSE 'LAST' END AS nulls,
      i.indisunique AS is_unique,
      i.indisprimary AS is_primary
    FROM pg_index AS i
    JOIN pg_class AS trel ON trel.oid = i.indrelid
    JOIN pg_namespace AS tnsp ON trel.relnamespace = tnsp.oid
    JOIN pg_class AS irel ON irel.oid = i.indexrelid
    CROSS JOIN LATERAL unnest (i.indkey) WITH ORDINALITY AS c (colnum, ordinality)
    LEFT JOIN LATERAL unnest (i.indoption) WITH ORDINALITY AS o (option, ordinality)
      ON c.ordinality = o.ordinality
    JOIN pg_attribute AS a ON trel.oid = a.attrelid AND a.attnum = c.colnum
    WHERE tnsp.nspname = current_schema() AND trel.relname = ?
    ORDER BY index_name, seq_in_index`,
          ['foo'],
        );

        expect(collection).toEqual({
          name: 'foo',
          fields: {
            id: {
              name: 'id',
              type: 'number',
              nullable: false,
              size: null,
              precision: 32,
              scale: 0,
            },
            name: {
              name: 'name',
              type: 'string',
              nullable: true,
              size: 50,
              precision: null,
              scale: null,
            },
            email: {
              name: 'email',
              type: 'string',
              nullable: false,
              size: 100,
              precision: null,
              scale: null,
            },
            phone: {
              name: 'phone',
              type: 'string',
              nullable: true,
              size: 20,
              precision: null,
              scale: null,
            },
            created_at: {
              name: 'created_at',
              type: 'date-time',
              nullable: false,
              size: null,
              precision: null,
              scale: null,
            },
            updated_at: {
              name: 'updated_at',
              type: 'date-time',
              nullable: false,
              size: null,
              precision: null,
              scale: null,
            },
          },
          primaryKey: {
            name: 'foo_pkey',
            fields: { id: { sort: 'asc' } },
            unique: 'primary',
            auto: 'increment',
          },
          indexes: {
            foo_pkey: {
              name: 'foo_pkey',
              fields: { id: { sort: 'asc' } },
              unique: 'primary',
              auto: 'increment',
            },
            idx_email: {
              name: 'idx_email',
              fields: { email: { sort: 'asc' } },
              unique: true,
            },
            idx_phone_email: {
              name: 'idx_phone_email',
              fields: { phone: { sort: 'desc' }, email: { sort: 'asc' } },
              unique: false,
            },
          },
        });
      });
    });
  });
});
