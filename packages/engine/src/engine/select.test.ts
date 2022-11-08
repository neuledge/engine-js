import { Category, Post } from '@/generated/__test__/category-post-example.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { convertSelect } from './select.js';

describe('engine/select', () => {
  describe('convertSelect', () => {
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = Metadata.generate([Category, ...Post]);

      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should convert empty object', () => {
      const res = convertSelect(postsCollection, {});

      expect(res).toEqual({});
    });

    it('should convert a select object', () => {
      const res = convertSelect(postsCollection, {
        select: {
          title: true,
          id: true,
          content: false,
        },
      });

      expect(res).toEqual({ select: { title: true, id: true } });
    });

    it('should ignore unknown fields', () => {
      const res = convertSelect(postsCollection, {
        select: {
          title: false,
          id: true,
          foo: true,
        },
      });

      expect(res).toEqual({ select: { id: true } });
    });
  });
});
