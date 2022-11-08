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

    it('should convert a select object', () => {
      const select = convertSelect(postsCollection, {
        title: true,
        id: true,
        content: false,
      });

      expect(select).toEqual({ title: true, id: true });
    });

    it('should ignore unknown fields', () => {
      const select = convertSelect(postsCollection, {
        title: false,
        id: true,
        foo: true,
      });

      expect(select).toEqual({ id: true });
    });
  });
});
