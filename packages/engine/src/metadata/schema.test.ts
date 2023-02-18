import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { MetadataCollection } from './collection';
import { Metadata } from './metadata';
import { getMetadataSchema } from './schema';

/* eslint-disable max-lines-per-function */

describe('engine/metadata/schema', () => {
  describe('getMetadataSchema()', () => {
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = new Metadata([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should return empty schema', () => {
      expect(getMetadataSchema([])).toEqual({});
    });

    it('should return Category schema', () => {
      expect(getMetadataSchema(categoriesCollection.states)).toEqual({
        id: [{ field: categoriesCollection.getSchemaFields('id')[0] }],
        name: [{ field: categoriesCollection.getSchemaFields('name')[0] }],
        description: [
          { field: categoriesCollection.getSchemaFields('description')[0] },
        ],
      });
    });

    it('should return Post schema', () => {
      expect(getMetadataSchema(postsCollection.states)).toEqual({
        category: [
          {
            schema: {
              id: [
                { field: postsCollection.getSchemaFields('category.id')[0] },
              ],
            },
          },
        ],
        'category.id': [
          {
            field: {
              ...postsCollection.getSchemaFields('category.id')[0],
              indexes: [2, 1],
            },
          },
          {
            field: {
              ...postsCollection.getSchemaFields('category.id')[1],
              indexes: [256, 1],
            },
          },
        ],
        id: [
          {
            field: {
              ...postsCollection.getSchemaFields('id')[0],
              indexes: [1],
            },
          },
        ],
        title: [
          {
            field: {
              ...postsCollection.getSchemaFields('title')[0],
              indexes: [3],
            },
          },
        ],
        content: [
          { field: postsCollection.getSchemaFields('content')[0] },
          { field: postsCollection.getSchemaFields('content')[1] },
        ],
        publishedAt: [
          { field: postsCollection.getSchemaFields('publishedAt')[0] },
        ],
      });
    });
  });
});
