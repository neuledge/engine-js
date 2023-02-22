import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import { convertFilterQuery, convertWhereFilterQuery } from './index';

/* eslint-disable max-lines-per-function */

describe('engine/where', () => {
  let categoriesCollection: MetadataCollection;
  let postsCollection: MetadataCollection;

  beforeAll(() => {
    const metadata = new Metadata([Category, ...Post]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    metadata
      .findStateByKey(Post[0].$name)!
      .fields.find((item) => item.name === 'content')!.name = 'description';

    categoriesCollection = metadata.getCollections([Category])[0];
    postsCollection = metadata.getCollections(Post)[0];
  });

  describe('convertWhereFilterQuery()', () => {
    it('should convert empty object', () => {
      expect(
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {},
        ),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
        },
      });
    });

    it('should convert simple equal where', () => {
      expect(
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: { id: { $eq: 1 } },
          },
        ),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          id: { $eq: 1 },
        },
      });
    });

    it('should convert equal null where', () => {
      expect(
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: { id: { $eq: null } },
          },
        ),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          id: { $eq: null },
        },
      });
    });

    it('should throw on undefined field where', () => {
      expect(() =>
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: { foo: { $eq: 1 } },
          },
        ),
      ).toThrow("Unknown where key: 'foo'");
    });

    it('should convert simple where with filter', () => {
      expect(
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: { id: { $eq: 1 } },
            filter: { description: { $eq: 'foo' } },
          },
        ),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          id: { $eq: 1 },
          description: { $eq: 'foo' },
        },
      });
    });

    it('should throw on conflit where and filter', () => {
      expect(() =>
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: { id: { $eq: 1 } },
            filter: { id: { $eq: 2 } },
          },
        ),
      ).toThrow("Duplicate where key: 'id'");
    });

    it('should convert between ranges where', () => {
      expect(
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: { id: { $gt: 5, $lte: 10 } },
          },
        ),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          id: { $gt: 5, $lte: 10 },
        },
      });
    });

    it('should convert $or where', () => {
      expect(
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: {
              $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }],
            },
          },
        ),
      ).toEqual({
        where: {
          $or: [
            {
              __h: {
                $in: categoriesCollection.states.map((item) => item.hash),
              },
              id: { $gt: 5, $lte: 10 },
            },
            {
              __h: {
                $in: categoriesCollection.states.map((item) => item.hash),
              },
              id: { $eq: 100 },
            },
          ],
        },
      });
    });

    it('should handle $or on both where and filter', () => {
      expect(
        convertWhereFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {
            where: {
              $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }],
            },
            filter: {
              $or: [{ name: { $eq: 'foo' } }, { name: { $eq: 'bar' } }],
            },
          },
        ),
      ).toEqual({
        where: {
          $or: [
            {
              __h: {
                $in: categoriesCollection.states.map((item) => item.hash),
              },
              id: { $gt: 5, $lte: 10 },
              name: { $eq: 'foo' },
            },
            {
              __h: {
                $in: categoriesCollection.states.map((item) => item.hash),
              },
              id: { $eq: 100 },
              name: { $eq: 'foo' },
            },
            {
              __h: {
                $in: categoriesCollection.states.map((item) => item.hash),
              },
              id: { $gt: 5, $lte: 10 },
              name: { $eq: 'bar' },
            },
            {
              __h: {
                $in: categoriesCollection.states.map((item) => item.hash),
              },
              id: { $eq: 100 },
              name: { $eq: 'bar' },
            },
          ],
        },
      });
    });

    it('should handle renamed field in state where', () => {
      expect(
        convertWhereFilterQuery(postsCollection.states, postsCollection, {
          where: { content: { $eq: 'foo' } },
        }),
      ).toEqual({
        where: {
          $or: [
            {
              __h: { $in: postsCollection.states.map((item) => item.hash) },
              description: { $eq: 'foo' },
            },
            {
              __h: { $in: postsCollection.states.map((item) => item.hash) },
              content: { $eq: 'foo' },
            },
          ],
        },
      });
    });

    it('should handle category id scalar where', () => {
      expect(
        convertWhereFilterQuery(postsCollection.states, postsCollection, {
          where: { category: { $eq: { id: 1 } } },
        }),
      ).toEqual({
        where: {
          __h: { $in: postsCollection.states.map((item) => item.hash) },
          category_id: { $eq: 1 },
        },
      });
    });
  });

  describe('convertFilterQuery()', () => {
    it('should convert empty object', () => {
      expect(
        convertFilterQuery(
          categoriesCollection.states,
          categoriesCollection,
          {},
        ),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
        },
      });
    });

    it('should convert simple equal where', () => {
      expect(
        convertFilterQuery(categoriesCollection.states, categoriesCollection, {
          filter: { name: { $eq: 'foo' } },
        }),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          name: { $eq: 'foo' },
        },
      });
    });
  });
});
