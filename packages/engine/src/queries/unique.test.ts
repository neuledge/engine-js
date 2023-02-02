import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Unique } from './unique';

describe('queries/unique', () => {
  describe('Unique<>', () => {
    it('should have all fields for single state', () => {
      type t = Unique<typeof Category>;

      expect<t>({ id: 123 });

      expect<t>({
        // @ts-expect-error Expect 'id' to defined
        id: undefined,
      });

      // @ts-expect-error Expect 'id' to defined
      expect<t>({});
    });

    it('should have common fields for multiple states', () => {
      type t = Unique<typeof Post[number]>;

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
