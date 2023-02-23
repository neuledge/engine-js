import {
  Post,
  PublishedPost,
} from '@/definitions/__fixtures__/category-post-example';
import { Filter } from './filter';

/* eslint-disable max-lines-per-function */

describe('queries/filter', () => {
  describe('Filter<>', () => {
    it('should have all fields for single state', () => {
      type t = Filter<typeof PublishedPost>;

      expect<t>({ id: null });
      expect<t>({ id: { $eq: 123 } });
      expect<t>({ id: { $lt: 123, $gt: 100 } });

      // @ts-expect-error Can't have both $eq and $lt
      expect<t>({ id: { $lt: 123, $eq: 100 } });

      expect<t>({ category: { $eq: { id: 123 } } });
      expect<t>({ category: { $eq: { id: 123 } }, title: { $eq: 'Hello' } });

      expect<t>({ title: { $eq: 'Hello' } });

      expect<t>({ publishedAt: { $eq: new Date('2020-01-01') } });
    });

    it('should allow $or on single state', () => {
      type t = Filter<typeof PublishedPost>;

      expect<t>({
        $or: [
          { publishedAt: { $eq: new Date('2020-01-01') } },
          { id: { $eq: 456 } },
        ],
      });
    });

    it('should have common fields for multiple states', () => {
      type t = Filter<(typeof Post)[number]>;

      expect<t>({ id: { $eq: 123 } });
      expect<t>({ id: null });
      expect<t>({});

      expect<t>({ category: null });
      expect<t>({ title: null });
      expect<t>({ category: { $eq: { id: 123 } } });
      expect<t>({ title: { $eq: 'Hello' } });

      expect<t>({ publishedAt: null });

      // @ts-expect-error Property 'publishedAt' does not defined on both states
      expect<t>({ publishedAt: { $eq: new Date('2020-01-01') } });
    });

    it('should allow $or on multiple states', () => {
      type t = Filter<(typeof Post)[number]>;

      expect<t>({
        $or: [{ title: { $eq: 'Hello' } }, { id: { $eq: 456 } }],
      });

      expect<t>({
        $or: [{ publishedAt: null }, { id: { $eq: 456 } }],
      });

      expect<t>({
        $or: [
          // @ts-expect-error Property 'publishedAt' doesn't defined
          { publishedAt: { $eq: new Date('2020-01-01') } },
          { id: { $eq: 456 } },
        ],
      });
    });
  });
});
