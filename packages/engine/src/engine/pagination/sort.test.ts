import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import { convertSortQuery } from './sort';

describe('engine/sort', () => {
  describe('convertSort', () => {
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = new Metadata([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should throw on unknown sort string', () => {
      expect(() => convertSortQuery(postsCollection, { sort: '+foo' })).toThrow(
        'Unknown sort index: foo',
      );
    });

    it('should convert an empty sort', () => {
      const res = convertSortQuery(postsCollection, {});

      expect(res).toEqual({});
    });

    it('should convert a sort asc string to a sort object', () => {
      const res = convertSortQuery(postsCollection, {
        sort: '+category_title',
      });

      expect(res).toEqual({ sort: { category_id: 'desc', title: 'asc' } });
      expect(Object.keys(res.sort ?? {})).toEqual(['category_id', 'title']);
    });

    it('should convert a sort desc string to a sort object', () => {
      const res = convertSortQuery(postsCollection, {
        sort: '-category_title',
      });

      expect(res).toEqual({ sort: { category_id: 'asc', title: 'desc' } });
      expect(Object.keys(res.sort ?? {})).toEqual(['category_id', 'title']);
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
