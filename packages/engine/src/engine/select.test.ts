import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import { convertSelectQuery } from './select';

describe('engine/retrive/select', () => {
  describe('convertSelectQuery', () => {
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = new Metadata([Category, ...Post]);

      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should convert an empty object', () => {
      const res = convertSelectQuery(postsCollection, {});

      expect(res).toEqual({});
    });

    it('should convert a select object', () => {
      const res = convertSelectQuery(postsCollection, {
        select: {
          title: true,
          id: true,
          content: false,
        },
      });

      expect(res).toEqual({
        select: {
          title: true,
          id: true,
        },
      });
    });

    it('should ignore unknown fields', () => {
      const res = convertSelectQuery(postsCollection, {
        select: {
          title: false,
          id: true,
          foo: true,
        },
      });

      expect(res).toEqual({
        select: {
          id: true,
        },
      });
    });
  });
});
