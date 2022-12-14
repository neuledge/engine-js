import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { UniqueWhere, Where } from './where';

describe('queries/where', () => {
  describe('Where<>', () => {
    it('should have all fields for single state', () => {
      type t = Where<typeof Category>;

      expect<t>({ id: { $eq: 123 } });
      expect<t>({ id: { $lt: 123, $gt: 100 } });
      expect<t>({ id: undefined });
      expect<t>({});

      // @ts-expect-error Can't have both $eq and $lt
      expect<t>({ id: { $lt: 123, $eq: 100 } });
    });

    it('should have common fields for multiple states', () => {
      type t = Where<typeof Post[number]>;

      expect<t>({ id: { $eq: 123 } });
      expect<t>({ id: undefined });
      expect<t>({});

      expect<t>({
        // @ts-expect-error Property 'category' does not defined
        category: { id: { $eq: 123 } },
      });
    });
  });

  describe('UniqueWhere<>', () => {
    it('should have all fields for single state', () => {
      type t = UniqueWhere<typeof Category>;

      expect<t>({ id: 123 });

      expect<t>({
        // @ts-expect-error Expect 'id' to defined
        id: undefined,
      });

      // @ts-expect-error Expect 'id' to defined
      expect<t>({});
    });

    it('should have common fields for multiple states', () => {
      type t = UniqueWhere<typeof Post[number]>;

      expect<t>({ id: 123 });

      expect<t>({
        // @ts-expect-error Expect 'id' to defined
        id: undefined,
      });

      // @ts-expect-error Expect 'id' to defined
      expect<t>({});
    });
  });
});
