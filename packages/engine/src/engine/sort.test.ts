import { Category, Post } from '@/generated/__test__/category-post-example.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { convertSortQuery } from './sort.js';

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
      expect(() => convertSortQuery(postsCollection, { sort: '+foo' })).toThrow(
        'Unknown sort key: foo',
      );
    });

    it('should convert an empty sort', () => {
      const res = convertSortQuery(postsCollection, {});

      expect(res).toEqual({});
    });

    it('should convert a sort asc string to a sort object', () => {
      const res = convertSortQuery(postsCollection, {
        sort: '+category.posts',
      });

      expect(res).toEqual({ sort: { category: 'asc', title: 'asc' } });
      expect(Object.keys(res.sort ?? {})).toEqual(['category', 'title']);
    });

    it('should convert a sort desc string to a sort object', () => {
      const res = convertSortQuery(postsCollection, {
        sort: '-category.posts',
      });

      expect(res).toEqual({ sort: { category: 'desc', title: 'desc' } });
      expect(Object.keys(res.sort ?? {})).toEqual(['category', 'title']);
    });

    it('should convert sort fields', () => {
      const res = convertSortQuery(categoriesCollection, {
        sort: ['+name', '-description'],
      });

      expect(res).toEqual({ sort: { name: 'asc', description: 'desc' } });
      expect(Object.keys(res.sort ?? {})).toEqual(['name', 'description']);
    });

    it('should ignore on unknown sort field', () => {
      const res = convertSortQuery(categoriesCollection, {
        sort: ['+name', '-foo'],
      });

      expect(res).toEqual({ sort: { name: 'asc' } });
    });
  });
});
