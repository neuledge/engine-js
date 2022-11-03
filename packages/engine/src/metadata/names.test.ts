import {
  Category,
  DraftPost,
  PublishedPost,
} from '@/generated/__test__/category-post-example.js';
import { generateStateCollectionNames } from './names.js';

describe('metadata/names', () => {
  describe('generateStateCollectionNames()', () => {
    it('should generate collection name for categories', () => {
      expect(generateStateCollectionNames([Category])).toEqual({
        Category: 'categories',
        'Category.id': 'id',
        'Category.name': 'name',
        'Category.description': 'description',
      });
    });

    it('should generate collection name for posts', () => {
      expect(generateStateCollectionNames([DraftPost, PublishedPost])).toEqual({
        DraftPost: 'posts',
        'DraftPost.id': 'id',
        'DraftPost.category': 'category',
        'DraftPost.title': 'title',
        'DraftPost.content': 'content',

        PublishedPost: 'posts',
        'PublishedPost.id': 'id',
        'PublishedPost.category': 'category',
        'PublishedPost.title': 'title',
        'PublishedPost.content': 'content',
      });
    });

    it('should generate collection names for posts and categories', () => {
      expect(
        generateStateCollectionNames([Category, DraftPost, PublishedPost]),
      ).toEqual({
        Category: 'categories',
        'Category.id': 'id',
        'Category.name': 'name',
        'Category.description': 'description',

        DraftPost: 'posts',
        'DraftPost.id': 'id',
        'DraftPost.category': 'category',
        'DraftPost.title': 'title',
        'DraftPost.content': 'content',

        PublishedPost: 'posts',
        'PublishedPost.id': 'id',
        'PublishedPost.category': 'category',
        'PublishedPost.title': 'title',
        'PublishedPost.content': 'content',
      });
    });
  });
});
