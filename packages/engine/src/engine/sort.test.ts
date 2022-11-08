import { Category, Post } from '@/generated/__test__/category-post-example.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { convertSort } from './sort.js';

describe('engine/sort', () => {
  describe('convertSort', () => {
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = Metadata.generate([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should throw on unknown sort string', () => {
      expect(() => convertSort(postsCollection, '+foo')).toThrow(
        'Unknown sort key: foo',
      );
    });

    it('should convert a sort asc string to a sort object', () => {
      const sort = convertSort(postsCollection, '+category.posts');

      expect(sort).toEqual({ category: 'asc', title: 'asc' });
      expect(Object.keys(sort)).toEqual(['category', 'title']);
    });

    it('should convert a sort desc string to a sort object', () => {
      const sort = convertSort(postsCollection, '-category.posts');

      expect(sort).toEqual({ category: 'desc', title: 'desc' });
      expect(Object.keys(sort)).toEqual(['category', 'title']);
    });

    it('should convert sort fields', () => {
      const sort = convertSort(categoriesCollection, ['+name', '-description']);

      expect(sort).toEqual({ name: 'asc', description: 'desc' });
      expect(Object.keys(sort)).toEqual(['name', 'description']);
    });

    it('should ignore on unknown sort field', () => {
      const sort = convertSort(categoriesCollection, ['+name', '-foo']);

      expect(sort).toEqual({ name: 'asc' });
    });
  });
});
