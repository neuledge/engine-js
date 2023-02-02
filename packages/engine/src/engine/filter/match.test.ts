import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import { convertMatchQuery } from './match';

/* eslint-disable max-lines-per-function */

describe('engine/match', () => {
  describe('convertMatchQuery()', () => {
    let metadata: Metadata;
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      metadata = new Metadata([Category, ...Post]);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      metadata
        .findStateByKey(Post[0].$name)!
        .fields.find((item) => item.name === 'content')!.name = 'description';

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];
    });

    it('should handle empty query', () => {
      expect(
        convertMatchQuery<typeof Post[number]>(metadata, postsCollection, {}),
      ).toEqual({});
    });

    it('should handle empty filter', () => {
      expect(
        convertMatchQuery<typeof Post[number]>(metadata, postsCollection, {
          match: {},
        }),
      ).toEqual({
        match: {},
      });
    });

    it('should handle filter by category', () => {
      expect(
        convertMatchQuery(metadata, postsCollection, {
          match: { category: { where: { id: { $eq: 1 } } } },
        }),
      ).toEqual({
        match: {
          category: [
            {
              collection: metadata['collections'].categories,
              by: { category_id: { field: 'id' } },
              where: {
                __h: {
                  $in: categoriesCollection.states.map((item) => item.hash),
                },
                id: { $eq: 1 },
              },
            },
          ],
        },
      });
    });
  });
});
