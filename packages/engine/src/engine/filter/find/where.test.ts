import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import { convertWhereQuery } from './index';

/* eslint-disable max-lines-per-function */

describe('engine/where', () => {
  describe('convertWhereQuery()', () => {
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

    it('should convert empty object', () => {
      expect(
        convertWhereQuery(
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
        convertWhereQuery(categoriesCollection.states, categoriesCollection, {
          where: { id: { $eq: 1 } },
        }),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          id: { $eq: 1 },
        },
      });
    });

    it('should convert equal null where', () => {
      expect(
        convertWhereQuery(categoriesCollection.states, categoriesCollection, {
          where: { id: { $eq: null } },
        }),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          id: { $eq: null },
        },
      });
    });

    it('should throw on undefined field where', () => {
      expect(() =>
        convertWhereQuery(categoriesCollection.states, categoriesCollection, {
          where: { foo: { $eq: 1 } },
        }),
      ).toThrow("Unknown where key: 'foo'");
    });

    it('should convert between ranges where', () => {
      expect(
        convertWhereQuery(categoriesCollection.states, categoriesCollection, {
          where: { id: { $gt: 5, $lte: 10 } },
        }),
      ).toEqual({
        where: {
          __h: { $in: categoriesCollection.states.map((item) => item.hash) },
          id: { $gt: 5, $lte: 10 },
        },
      });
    });

    it('should convert $or where', () => {
      expect(
        convertWhereQuery(categoriesCollection.states, categoriesCollection, {
          where: {
            $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }],
          },
        }),
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

    it('should handle renamed field in state where', () => {
      expect(
        convertWhereQuery(postsCollection.states, postsCollection, {
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
        convertWhereQuery(postsCollection.states, postsCollection, {
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
});
