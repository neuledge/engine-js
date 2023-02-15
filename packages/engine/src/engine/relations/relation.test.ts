import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import { convertRelationQueryOptions } from './relation';

/* eslint-disable max-lines-per-function */

describe('engine/relations/relation', () => {
  describe('convertRelationQueryOptions()', () => {
    let metadata: Metadata;
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      metadata = new Metadata([Category, ...Post]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      metadata
        .findStateByKey(Post[0].$name)!
        .fields.find((item) => item.name === 'content')!.name = 'description';

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should handle empty filter', () => {
      expect(
        convertRelationQueryOptions(
          metadata,
          postsCollection,
          {},
          (relation) => relation,
        ),
      ).toEqual({});
    });

    it('should handle filter by category', () => {
      expect(
        convertRelationQueryOptions(
          metadata,
          postsCollection,
          {
            category: {
              states: undefined,
              where: 'foo',
            },
          },
          (relation) => relation,
        ),
      ).toEqual({
        category: [
          {
            collection: metadata['collections'].categories,
            by: { id: { field: 'category_id' } },
            query: { where: 'foo' },
          },
        ],
      });
    });

    it('should handle filter by category with states', () => {
      expect(
        convertRelationQueryOptions(
          metadata,
          postsCollection,
          {
            category: {
              states: [categoriesCollection.states[0].instance],
              where: 'foo',
            },
          },
          (relation) => relation,
        ),
      ).toEqual({
        category: [
          {
            collection: metadata['collections'].categories,
            by: { id: { field: 'category_id' } },
            query: {
              states: [categoriesCollection.states[0].instance],
              where: 'foo',
            },
          },
        ],
      });
    });

    it('should handle filter by posts', () => {
      expect(
        convertRelationQueryOptions(
          metadata,
          categoriesCollection,
          {
            posts: {
              states: undefined,
              where: 'foo',
            },
          },
          (relation) => relation,
        ),
      ).toEqual({
        posts: [
          {
            collection: metadata['collections'].posts,
            by: { category_id: { field: 'id' } },
            query: { where: 'foo' },
          },
        ],
      });
    });

    it('should handle filter by posts with state', () => {
      expect(
        convertRelationQueryOptions(
          metadata,
          categoriesCollection,
          {
            posts: {
              states: [postsCollection.states[1].instance],
              where: 'foo',
            },
          },
          (relation) => relation,
        ),
      ).toEqual({
        posts: [
          {
            collection: metadata['collections'].posts,
            by: { category_id: { field: 'id' } },
            query: {
              states: [postsCollection.states[1].instance],
              where: 'foo',
            },
          },
        ],
      });
    });
  });
});
