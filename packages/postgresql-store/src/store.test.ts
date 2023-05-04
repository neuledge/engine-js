import {
  listIndexAttributes_sql,
  listTableColumns_sql,
  listTables_sql,
} from './queries';
import {
  postsCollection,
  postsTableName,
  postsTableRow1,
} from './queries/__fixtures__/posts-table';
import {
  usersCollection,
  usersCollection_slim,
  usersTable,
  usersTableColumns,
  usersTableIndexes,
  usersTableName,
  usersTablePrimaryIndexes,
  usersTableRow1,
  usersTable_createSql,
  usersTable_dropSql,
  usersTable_emailIndexCreateSql,
  usersTable_phoneAddSql,
  usersTable_phoneEmailIndexCreateSql,
} from './queries/__fixtures__/users-table';
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
        const end = jest.fn().mockResolvedValue(void 0);

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
      query = jest.fn().mockRejectedValue(new Error('unexpected query call'));

      store = new PostgreSQLStore({
        client: { query } as never,
      });
    });

    describe('.listCollections()', () => {
      it('should be able to list collections', async () => {
        query.mockResolvedValueOnce({ rows: [usersTable] });

        const collections = await store.listCollections();

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(listTables_sql);

        expect(collections).toEqual([usersCollection_slim]);
      });
    });

    describe('.describeCollection()', () => {
      it('should be able to describe a collection', async () => {
        query.mockResolvedValueOnce({ rows: usersTableColumns });
        query.mockResolvedValueOnce({ rows: usersTableIndexes });

        const collection = await store.describeCollection({
          collection: usersCollection_slim,
        });

        expect(query).toHaveBeenCalledTimes(2);
        expect(query).toHaveBeenNthCalledWith(1, listTableColumns_sql, [
          usersTableName,
        ]);
        expect(query).toHaveBeenNthCalledWith(2, listIndexAttributes_sql, [
          usersTableName,
        ]);

        expect(collection).toEqual(usersCollection);
      });
    });

    describe('.ensureCollection()', () => {
      it('should skip create an existing table', async () => {
        query.mockResolvedValueOnce({ rows: [] });
        query.mockResolvedValueOnce({ rows: usersTableColumns });
        query.mockResolvedValueOnce({ rows: usersTableIndexes });

        await store.ensureCollection({
          collection: usersCollection,
          fields: Object.values(usersCollection.fields),
          indexes: Object.values(usersCollection.indexes),
        });

        expect(query).toHaveBeenCalledTimes(3);
        expect(query).toHaveBeenNthCalledWith(1, usersTable_createSql);
        expect(query).toHaveBeenNthCalledWith(2, listTableColumns_sql, [
          usersTableName,
        ]);
        expect(query).toHaveBeenNthCalledWith(3, listIndexAttributes_sql, [
          usersTableName,
        ]);
      });

      it('should create a new table', async () => {
        query.mockResolvedValueOnce({ rows: [] });
        query.mockResolvedValueOnce({ rows: usersTableColumns });
        query.mockResolvedValueOnce({ rows: usersTablePrimaryIndexes });
        query.mockResolvedValueOnce({ rows: [] });
        query.mockResolvedValueOnce({ rows: [] });

        await store.ensureCollection({
          collection: usersCollection,
          fields: Object.values(usersCollection.fields),
          indexes: Object.values(usersCollection.indexes),
        });

        expect(query).toHaveBeenCalledTimes(5);
        expect(query).toHaveBeenNthCalledWith(1, usersTable_createSql);
        expect(query).toHaveBeenNthCalledWith(2, listTableColumns_sql, [
          usersTableName,
        ]);
        expect(query).toHaveBeenNthCalledWith(3, listIndexAttributes_sql, [
          usersTableName,
        ]);
        expect(query).toHaveBeenNthCalledWith(
          4,
          usersTable_emailIndexCreateSql,
        );
        expect(query).toHaveBeenNthCalledWith(
          5,
          usersTable_phoneEmailIndexCreateSql,
        );
      });

      it('should create fill missing fields and indexes', async () => {
        query.mockResolvedValueOnce({ rows: [] });
        query.mockResolvedValueOnce({
          rows: usersTableColumns.filter((c) => c.column_name !== 'phone'),
        });
        query.mockResolvedValueOnce({
          rows: usersTableIndexes.filter(
            (i) => !i.index_name.includes('phone'),
          ),
        });
        query.mockResolvedValueOnce({ rows: [] });
        query.mockResolvedValueOnce({ rows: [] });

        await store.ensureCollection({
          collection: usersCollection,
          fields: Object.values(usersCollection.fields),
          indexes: Object.values(usersCollection.indexes),
        });

        expect(query).toHaveBeenCalledTimes(5);
        expect(query).toHaveBeenNthCalledWith(1, usersTable_createSql);
        expect(query).toHaveBeenNthCalledWith(2, listTableColumns_sql, [
          usersTableName,
        ]);
        expect(query).toHaveBeenNthCalledWith(3, listIndexAttributes_sql, [
          usersTableName,
        ]);
        expect(query).toHaveBeenNthCalledWith(4, usersTable_phoneAddSql);
        expect(query).toHaveBeenNthCalledWith(
          5,
          usersTable_phoneEmailIndexCreateSql,
        );
      });
    });

    describe('.dropCollection()', () => {
      it('should be able to drop a collection', async () => {
        query.mockResolvedValueOnce({ rows: [] });

        await store.dropCollection({ collection: usersCollection });

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(usersTable_dropSql);
      });
    });

    describe('.find()', () => {
      it('should be able to find documents', async () => {
        query.mockResolvedValueOnce({ rows: [usersTableRow1] });

        const res = await store.find({
          collection: usersCollection,
          where: {
            email: { $eq: 'john@example.com' },
          },
          limit: 1,
        });

        expect(query).toHaveBeenCalledTimes(1);

        expect(query).toHaveBeenCalledWith(
          `SELECT * FROM ${usersTableName} WHERE email = 'john@example.com' LIMIT 1 OFFSET 0`,
        );

        expect(res).toEqual(Object.assign([usersTableRow1], { nextOffset: 1 }));
      });

      it('should be able to find documents with offset', async () => {
        query.mockResolvedValueOnce({ rows: [] });

        const res = await store.find({
          collection: usersCollection,
          where: {
            email: { $eq: 'john@example.com' },
          },
          limit: 1,
          offset: 1,
        });
        expect(query).toHaveBeenCalledTimes(1);

        expect(query).toHaveBeenCalledWith(
          `SELECT * FROM ${usersTableName} WHERE email = 'john@example.com' LIMIT 1 OFFSET 1`,
        );

        expect(res).toEqual(Object.assign([], { nextOffset: null }));
      });

      it('should be able to select columns', async () => {
        query.mockResolvedValueOnce({ rows: [usersTableRow1] });

        const res = await store.find({
          collection: usersCollection,
          select: {
            id: true,
            name: true,
            phone: false,
          },
          limit: 1,
        });

        expect(query).toHaveBeenCalledTimes(1);

        expect(query).toHaveBeenCalledWith(
          `SELECT id, name FROM ${usersTableName} LIMIT 1 OFFSET 0`,
        );

        expect(res).toEqual(Object.assign([usersTableRow1], { nextOffset: 1 }));
      });

      it('should be able to join tables', async () => {
        query.mockResolvedValueOnce({
          rows: [{ ...postsTableRow1, author$0: usersTableRow1 }],
        });

        const res = await store.find({
          collection: postsCollection,
          innerJoin: {
            author: [
              {
                collection: usersCollection,
                select: true,
                by: { author_id: { field: 'id' } },
              },
            ],
          },
          limit: 1,
        });

        expect(query).toHaveBeenCalledTimes(1);

        expect(query).toHaveBeenCalledWith(
          `SELECT "$".*, author$0.id AS "author$0.id", author$0.name AS "author$0.name", author$0.email AS "author$0.email", author$0.phone AS "author$0.phone", author$0.created_at AS "author$0.created_at", author$0.updated_at AS "author$0.updated_at" FROM ${postsTableName} "$" INNER JOIN ${usersTableName} author$0 ON (author$0.author_id = "$".id) LIMIT 1 OFFSET 0`,
        );

        expect(res).toEqual(
          Object.assign([{ ...postsTableRow1, author: usersTableRow1 }], {
            nextOffset: 1,
          }),
        );
      });

      it('should be able to sort documents', async () => {
        query.mockResolvedValueOnce({ rows: [usersTableRow1] });

        const res = await store.find({
          collection: usersCollection,
          sort: {
            name: 'desc',
            email: 'asc',
          },
          limit: 1,
        });

        expect(query).toHaveBeenCalledTimes(1);

        expect(query).toHaveBeenCalledWith(
          `SELECT * FROM ${usersTableName} ORDER BY name DESC, email ASC LIMIT 1 OFFSET 0`,
        );

        expect(res).toEqual(Object.assign([usersTableRow1], { nextOffset: 1 }));
      });
    });

    describe('.insert()', () => {
      it('should be able to insert a document with auto increment', async () => {
        query.mockResolvedValueOnce({ rows: [{ id: 1234 }] });

        const res = await store.insert({
          collection: usersCollection,
          documents: [
            {
              name: 'John Doe',
              email: 'john@example.com',
              created_at: new Date('2020-01-01T00:00:00.000Z'),
              updated_at: new Date('2020-01-01T00:00:00.000Z'),
            },
          ],
        });

        expect(query).toHaveBeenCalledTimes(1);

        expect(query).toHaveBeenCalledWith(
          `INSERT INTO ${usersTableName} (id, name, email, phone, created_at, updated_at) VALUES (DEFAULT, 'John Doe', 'john@example.com', NULL, '2020-01-01 00:00:00.000+00', '2020-01-01 00:00:00.000+00') RETURNING id`,
        );

        expect(res).toEqual({
          affectedCount: 1,
          insertedIds: [{ id: 1234 }],
        });
      });

      it('should be able to insert a document with custom id', async () => {
        query.mockResolvedValueOnce({ rows: [{ id: 789 }] });

        const res = await store.insert({
          collection: usersCollection,
          documents: [
            {
              id: 789,
              name: 'John Doe',
              email: 'john@example.com',
              created_at: new Date('2020-01-01T00:00:00.000Z'),
              updated_at: new Date('2020-01-01T00:00:00.000Z'),
            },
          ],
        });

        expect(query).toHaveBeenCalledTimes(1);

        expect(query).toHaveBeenCalledWith(
          `INSERT INTO ${usersTableName} (id, name, email, phone, created_at, updated_at) VALUES ('789', 'John Doe', 'john@example.com', NULL, '2020-01-01 00:00:00.000+00', '2020-01-01 00:00:00.000+00') RETURNING id`,
        );

        expect(res).toEqual({
          affectedCount: 1,
          insertedIds: [{ id: 789 }],
        });
      });
    });

    describe('.update()', () => {
      it('should be able to update a document', async () => {
        query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await store.update({
          collection: usersCollection,
          where: { id: { $eq: 123 } },
          set: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: undefined,
            updated_at: new Date('2020-01-01T00:00:00.000Z'),
          },
        });

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          `UPDATE ${usersTableName} SET name = 'John Doe', email = 'john@example.com', phone = NULL, updated_at = '2020-01-01 00:00:00.000+00' WHERE id = '123'`,
        );

        expect(res).toEqual({
          affectedCount: 1,
        });
      });

      it('should be able to update multiple arbitrary documents', async () => {
        query.mockResolvedValueOnce({ rowCount: 2 });

        const res = await store.update({
          collection: usersCollection,
          set: {
            name: 'John Doe',
            email: 'john@example.com',
            updated_at: new Date('2020-01-01T00:00:00.000Z'),
          },
        });

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          `UPDATE ${usersTableName} SET name = 'John Doe', email = 'john@example.com', updated_at = '2020-01-01 00:00:00.000+00'`,
        );

        expect(res).toEqual({
          affectedCount: 2,
        });
      });
    });

    describe('.delete()', () => {
      it('should be able to delete a document', async () => {
        query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await store.delete({
          collection: usersCollection,
          where: { id: { $eq: 123 } },
        });

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          `DELETE FROM ${usersTableName} WHERE id = '123'`,
        );

        expect(res).toEqual({
          affectedCount: 1,
        });
      });

      it('should be able to delete multiple arbitrary documents', async () => {
        query.mockResolvedValueOnce({ rowCount: 2 });

        const res = await store.delete({
          collection: usersCollection,
        });

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(`TRUNCATE TABLE ${usersTableName}`);

        expect(res).toEqual({
          affectedCount: 2,
        });
      });
    });
  });
});
