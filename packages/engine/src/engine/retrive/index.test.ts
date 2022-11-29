import {
  Category,
  Post,
} from '@/definitions/__test__/category-post-example.js';
import { Metadata, MetadataCollection } from '@/metadata/index.js';
import { convertRetriveQuery } from './index.js';

describe('engine/retrive', () => {
  describe('convertRetriveQuery', () => {
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = Metadata.generate([Category, ...Post]);

      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should convert an empty object', () => {
      const res = convertRetriveQuery(postsCollection, {});

      expect(res).toEqual({});
    });

    it('should convert a select object', () => {
      const res = convertRetriveQuery(postsCollection, {
        select: { id: true, title: true },
      });

      expect(res).toEqual({
        select: { id: true, title: true },
      });
    });
  });
});
