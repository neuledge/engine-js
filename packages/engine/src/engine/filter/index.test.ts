import {
  Category,
  Post,
} from '@/definitions/__test__/category-post-example.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { convertFilterQuery } from './index.js';

/* eslint-disable max-lines-per-function */

describe('engine/filter', () => {
  describe('convertFilterQuery()', () => {
    let metadata: Metadata;
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      metadata = Metadata.generate([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      postsCollection.states[0].fields.find(
        (item) => item.name === 'content',
      )!.name = 'description';
    });

    it('should convert empty object', () => {
      expect(convertFilterQuery(metadata, categoriesCollection, {})).toEqual(
        {},
      );
    });

    it('should convert simple equal where', () => {
      expect(
        convertFilterQuery(metadata, categoriesCollection, {
          where: { id: { $eq: 1 } },
        }),
      ).toEqual({
        where: { id: { $eq: 1 } },
      });
    });

    it('should convert equal null where', () => {
      expect(
        convertFilterQuery(metadata, categoriesCollection, {
          where: { id: { $eq: null } },
        }),
      ).toEqual({
        where: { id: { $eq: null } },
      });
    });

    it('should throw on undefined field where', () => {
      expect(() =>
        convertFilterQuery(metadata, categoriesCollection, {
          where: { foo: { $eq: 1 } },
        }),
      ).toThrow("Unknown where key: 'foo'");
    });

    it('should convert between ranges where', () => {
      expect(
        convertFilterQuery(metadata, categoriesCollection, {
          where: { id: { $gt: 5, $lte: 10 } },
        }),
      ).toEqual({
        where: { id: { $gt: 5, $lte: 10 } },
      });
    });

    it('should convert $or where', () => {
      expect(
        convertFilterQuery(metadata, categoriesCollection, {
          where: { $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }] },
        }),
      ).toEqual({
        where: { $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }] },
      });
    });

    it('should handle renamed field in state where', () => {
      expect(
        convertFilterQuery(metadata, postsCollection, {
          where: { content: { $eq: 'foo' } },
        }),
      ).toEqual({
        where: {
          $or: [{ description: { $eq: 'foo' } }, { content: { $eq: 'foo' } }],
        },
      });
    });

    it('should handle category id scalar where', () => {
      expect(
        convertFilterQuery(metadata, postsCollection, {
          where: { category: { $eq: { id: 1 } } },
        }),
      ).toEqual({
        where: { category_id: { $eq: 1 } },
      });
    });

    it('should handle empty filter', () => {
      expect(
        convertFilterQuery<typeof Post[number]>(metadata, postsCollection, {
          match: {},
        }),
      ).toEqual({
        match: {},
      });
    });

    it('should handle filter by category', () => {
      expect(
        convertFilterQuery(metadata, postsCollection, {
          match: { category: { where: { id: { $eq: 1 } } } },
        }),
      ).toEqual({
        match: {
          // FIXME return match
          // category: {
          //   collectionName: 'categories',
          //   relation: { category: 'id' },
          //   where: { id: { $eq: 1 } },
          // },
        },
      });
    });
  });
});
