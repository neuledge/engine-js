import {
  Post,
  PublishedPost,
} from '@/definitions/__fixtures__/category-post-example';
import { Where } from './where';

describe('queries/where', () => {
  describe('Where<>', () => {
    it('should have all fields for single state', () => {
      type t = Where<typeof PublishedPost>;

      expect<t>({ id: null });
      expect<t>({ id: { $eq: 123 } });
      expect<t>({ id: { $lt: 123, $gt: 100 } });

      // @ts-expect-error Can't have both $eq and $lt
      expect<t>({ id: { $lt: 123, $eq: 100 } });

      expect<t>({ category: { $eq: { id: 123 } } });
      expect<t>({ category: { $eq: { id: 123 } }, title: { $eq: 'Hello' } });

      // @ts-expect-error should not allow title without category
      expect<t>({ title: { $eq: 'Hello' } });
    });

    it('should allow $or on single state', () => {
      type t = Where<typeof PublishedPost>;

      expect<t>({
        $or: [{ category: { $eq: { id: 123 } } }, { id: { $eq: 456 } }],
      });
    });

    it('should have common fields for multiple states', () => {
      type t = Where<(typeof Post)[number]>;

      expect<t>({ id: { $eq: 123 } });
      expect<t>({ id: null });
      expect<t>({});

      expect<t>({ category: null });
      expect<t>({ title: null });

      // @ts-expect-error Property 'category' does not defined
      expect<t>({ category: { $eq: { id: 123 } } });

      // @ts-expect-error Property 'title' can't assign without category
      expect<t>({ title: { $eq: 'Hello' } });
    });

    it('should allow $or on multiple states', () => {
      type t = Where<(typeof Post)[number]>;

      expect<t>({
        $or: [{ id: { $eq: 123 } }, { id: { $eq: 456 } }],
      });

      expect<t>({
        $or: [{ category: null }, { id: { $eq: 456 } }],
      });

      // @ts-expect-error Property 'category' does not defined
      expect<t>({
        $or: [{ category: { $eq: { id: 123 } } }, { id: { $eq: 456 } }],
      });
    });
  });
});
