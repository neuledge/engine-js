import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import { convertRetriveQuery } from './index';

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
