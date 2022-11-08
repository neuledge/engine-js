import { Category, Post } from '@/generated/__test__/category-post-example.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { convertFilter } from './filter.js';

/* eslint-disable max-lines-per-function */

describe('engine/filter', () => {
  describe('convertFilter()', () => {
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = Metadata.generate([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];

      postsCollection.states[0].fields.content.fieldName = 'description';
    });

    it('should convert empty object', () => {
      expect(convertFilter(categoriesCollection, {})).toEqual({});
    });

    it('should convert simple equal where', () => {
      expect(
        convertFilter(categoriesCollection, {
          where: { id: { $eq: 1 } },
        }),
      ).toEqual({
        where: { id: { $eq: 1 } },
      });
    });

    it('should convert equal null where', () => {
      expect(
        convertFilter(categoriesCollection, {
          where: { id: { $eq: null } },
        }),
      ).toEqual({
        where: { id: { $eq: null } },
      });
    });

    it('should throw on undefined field', () => {
      expect(() =>
        convertFilter(categoriesCollection, {
          where: { foo: { $eq: 1 } },
        }),
      ).toThrow("Unknown field name: 'foo'");
    });

    it('should convert between where', () => {
      expect(
        convertFilter(categoriesCollection, {
          where: { id: { $gt: 5, $lte: 10 } },
        }),
      ).toEqual({
        where: { id: { $gt: 5, $lte: 10 } },
      });
    });

    it('should convert $or where', () => {
      expect(
        convertFilter(categoriesCollection, {
          where: { $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }] },
        }),
      ).toEqual({
        where: { $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }] },
      });
    });

    it('should handle renamed field in state', () => {
      expect(
        convertFilter(postsCollection, {
          where: { content: { $eq: 'foo' } },
        }),
      ).toEqual({
        where: {
          $or: [{ description: { $eq: 'foo' } }, { content: { $eq: 'foo' } }],
        },
      });
    });

    it('should handle category id', () => {
      expect(
        convertFilter(postsCollection, {
          where: { category: { $eq: { id: 1 } } },
        }),
      ).toEqual({
        where: { category: { $eq: 1 } },
      });
    });
  });
});
