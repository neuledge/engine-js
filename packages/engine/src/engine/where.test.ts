import { Category, Post } from '@/generated/__test__/category-post-example.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { convertWhere } from './where.js';

/* eslint-disable max-lines-per-function */

describe('engine/where', () => {
  describe('convertWhere()', () => {
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = Metadata.generate([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];

      postsCollection.states[0].fields.content.fieldName = 'description';
    });

    it('should convert simple equal where', () => {
      expect(
        convertWhere(categoriesCollection, {
          id: { $eq: 1 },
        }),
      ).toEqual({
        id: { $eq: 1 },
      });
    });

    it('should throw on undefined field', () => {
      expect(() =>
        convertWhere(categoriesCollection, {
          foo: { $eq: 1 },
        }),
      ).toThrow("Unknown field name: 'foo'");
    });

    it('should convert between where', () => {
      expect(
        convertWhere(categoriesCollection, {
          id: { $gt: 5, $lte: 10 },
        }),
      ).toEqual({
        id: { $gt: 5, $lte: 10 },
      });
    });

    it('should convert $or where', () => {
      expect(
        convertWhere(categoriesCollection, {
          $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }],
        }),
      ).toEqual({
        $or: [{ id: { $gt: 5, $lte: 10 } }, { id: { $eq: 100 } }],
      });
    });

    it('should handle renamed field in state', () => {
      expect(
        convertWhere(postsCollection, {
          content: { $eq: 'foo' },
        }),
      ).toEqual({
        $or: [{ description: { $eq: 'foo' } }, { content: { $eq: 'foo' } }],
      });
    });

    it('should handle category id', () => {
      expect(
        convertWhere(postsCollection, {
          category: { $eq: { id: 1 } },
        }),
      ).toEqual({
        category: { $eq: 1 },
      });
    });
  });
});
