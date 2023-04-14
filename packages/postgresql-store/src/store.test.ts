import {
  listIndexAttributes_sql,
  listTableColumns_sql,
  listTables_sql,
} from './queries';
import {
  usersCollection,
  usersCollection_slim,
  usersTable,
  usersTableColumns,
  usersTableIndexes,
  usersTableName,
  usersTable_createSql,
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
        query.mockResolvedValueOnce({ rows: [usersTable] });

        const collections = await store.listCollections();

        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(listTables_sql, []);

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
        expect(query).toHaveBeenNthCalledWith(1, usersTable_createSql, []);
        expect(query).toHaveBeenNthCalledWith(2, listTableColumns_sql, [
          usersTableName,
        ]);
        expect(query).toHaveBeenNthCalledWith(3, listIndexAttributes_sql, [
          usersTableName,
        ]);
      });
    });
  });
});
