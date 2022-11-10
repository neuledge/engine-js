import {
  Category,
  DraftPost,
  PublishedPost,
} from '@/generated/__test__/category-post-example.js';
import { getCollectionNames } from './collections.js';

describe('metadata/names', () => {
  describe('getCollectionNames()', () => {
    it('should generate collection name for category', () => {
      expect(getCollectionNames([Category])).toEqual({
        Category: 'categories',
      });
    });

    it('should generate collection name for posts', () => {
      expect(getCollectionNames([DraftPost, PublishedPost])).toEqual({
        DraftPost: 'posts',
        PublishedPost: 'posts',
      });
    });

    it('should generate collection names for posts and category', () => {
      expect(getCollectionNames([Category, DraftPost, PublishedPost])).toEqual({
        Category: 'categories',
        DraftPost: 'posts',
        PublishedPost: 'posts',
      });
    });
  });
});
