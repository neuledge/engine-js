import {
  Category,
  DraftPost,
  PublishedPost,
} from '@/definitions/__test__/category-post-example';
import { getCollectionNames } from './collections';

describe('metadata/names', () => {
  describe('getCollectionNames()', () => {
    it('should generate collection name for category', () => {
      expect(getCollectionNames([Category])).toEqual(
        new Map([['Category', 'categories']]),
      );
    });

    it('should generate collection name for posts', () => {
      expect(getCollectionNames([DraftPost, PublishedPost])).toEqual(
        new Map([
          ['DraftPost', 'posts'],
          ['PublishedPost', 'posts'],
        ]),
      );
    });

    it('should generate collection names for posts and category', () => {
      expect(getCollectionNames([Category, DraftPost, PublishedPost])).toEqual(
        new Map([
          ['Category', 'categories'],
          ['DraftPost', 'posts'],
          ['PublishedPost', 'posts'],
        ]),
      );
    });
  });
});
