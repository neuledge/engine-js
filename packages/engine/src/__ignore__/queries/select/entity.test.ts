import { Category, Post } from '@/generated/__test__/category-post-example.js';
import { Select } from './entity.js';

/* eslint-disable max-lines-per-function */

describe('queries/select/entity', () => {
  describe('Select<>', () => {
    it('should select fields', () => {
      type t = Select<typeof Category>;

      expect<t>({});
      expect<t>({ id: true });
      expect<t>({ id: false, name: false, description: false });
      expect<t>({ id: false, name: false, description: false });
    });

    it('should throw on unknown fields', () => {
      expect<Select<typeof Category>>({
        id: false,
        // @ts-expect-error Property 'foo' does not exists
        foo: true,
      });
    });

    it('should select multi-state fields', () => {
      type t = Select<typeof Post[number]>;

      expect<t>({});
      expect<t>({ id: true });
      expect<t>({ id: true, title: true, category: true });
      expect<t>({ id: true, publishedAt: true });
    });
  });
});
