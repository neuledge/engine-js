import {
  Category,
  DraftPost,
  PublishedPost,
} from '@/definitions/__fixtures__/category-post-example';
import { StateDefinition } from '@/index';
import { groupStatesByCollectionName } from './collections';

describe('metadata/names', () => {
  describe('groupStatesByCollectionName()', () => {
    it('should generate collection name for category', () => {
      expect(groupStatesByCollectionName([Category])).toEqual(
        new Map([['categories', new Set([Category])]]),
      );
    });

    it('should generate collection name for posts', () => {
      expect(groupStatesByCollectionName([DraftPost, PublishedPost])).toEqual(
        new Map([['posts', new Set([DraftPost, PublishedPost])]]),
      );
    });

    it('should generate collection names for posts and category', () => {
      expect(
        groupStatesByCollectionName([Category, DraftPost, PublishedPost]),
      ).toEqual(
        new Map<string, Set<StateDefinition>>([
          ['categories', new Set([Category])],
          ['posts', new Set([DraftPost, PublishedPost])],
        ]),
      );
    });
  });
});
