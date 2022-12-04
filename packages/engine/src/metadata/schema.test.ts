import { Category, Post } from '@/definitions/__test__/category-post-example';
import { MetadataCollection } from './collection';
import { Metadata } from './metadata';
import { getMetadataSchema } from './schema';

describe('engine/metadata/schema', () => {
  describe('getMetadataSchema()', () => {
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = Metadata.generate([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should return empty schema', () => {
      expect(getMetadataSchema([])).toEqual({});
    });

    it('should return Category schema', () => {
      expect(getMetadataSchema(categoriesCollection.states)).toEqual({
        id: [{ field: categoriesCollection.getFields('id')[0] }],
        name: [{ field: categoriesCollection.getFields('name')[0] }],
        description: [
          { field: categoriesCollection.getFields('description')[0] },
        ],
      });
    });

    it('should return Post schema', () => {
      expect(getMetadataSchema(postsCollection.states)).toEqual({
        category: [
          {
            schema: {
              id: [{ field: postsCollection.getFields('category.id')[0] }],
            },
          },
        ],
        'category.id': [{ field: postsCollection.getFields('category.id')[0] }],
        id: [{ field: postsCollection.getFields('id')[0] }],
        title: [{ field: postsCollection.getFields('title')[0] }],
        content: [{ field: postsCollection.getFields('content')[1] }],
        publishedAt: [{ field: postsCollection.getFields('publishedAt')[0] }],
      });
    });
  });
});
