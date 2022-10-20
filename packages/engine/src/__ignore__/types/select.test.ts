import { Select } from './select.js';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from './__test__/category-post-example.js';

/* eslint-disable max-lines-per-function */

describe('types/select', () => {
  describe('ProjectedEntity<>', () => {
    describe('single state', () => {
      it('should select scalar fields', () => {
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

      it('should not query relation only fields as scalars', () => {
        type t = Select<typeof Category>;

        expect<t>({ id: true, posts: undefined });

        expect<t>({
          id: true,
          // @ts-expect-error Property 'posts' should be object
          posts: true,
        });
      });

      it('should select relation fields with at least one state', () => {
        type t = Select<typeof Category>;

        expect<t>({ posts: { $states: [DraftPost] } });

        expect<t>({
          posts: {
            // @ts-expect-error states should have at least one State
            $states: [],
          },
        });
      });

      it('should select only relation defined state', () => {
        type t = Select<typeof Category>;

        expect<t>({ posts: { $states: [DraftPost] } });
        expect<t>({ posts: { $states: [PublishedPost] } });
        expect<t>({ posts: { $states: [DraftPost, PublishedPost] } });
        expect<t>({ posts: { $states: [...Post] } });
        expect<t>({ posts: { $states: Post } });

        expect<t>({
          posts: {
            // @ts-expect-error states should have at least one State
            $states: [Category],
          },
        });
      });

      it('should select relation fields', () => {
        expect<Select<typeof Category>>({
          posts: {
            $states: [PublishedPost],
            content: true,
          },
        });

        expect<Select<typeof Category>>({
          posts: {
            $states: [...Post],
            id: true,
            content: false,
          },
        });
      });

      it('should select relation fields only from one state', () => {
        expect<Select<typeof Category>>({
          posts: {
            $states: [PublishedPost],
            content: false,
            publishedAt: true,
          },
        });

        expect<Select<typeof Category>>({
          posts: {
            $states: [...Post],
            content: false,
            publishedAt: true,
          },
        });
      });

      it('should throw on unknown relation fields', () => {
        type t = Select<typeof Category>;

        expect<t>({
          posts: {
            $states: [...Post],
            content: false,
            // @ts-expect-error Property 'foo' does not exists
            foo: true,
          },
        });

        expect<t>({
          posts: {
            $states: [DraftPost],
            content: false,
            // @ts-expect-error Property 'publishedAt' does not exists
            publishedAt: true,
          },
        });
      });
    });
  });
});
