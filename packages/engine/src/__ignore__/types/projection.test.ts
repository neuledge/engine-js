import { ProjectedEntity } from './projection.js';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from './__test__/category-post-example.js';

/* eslint-disable max-lines-per-function */

describe('types/projection', () => {
  describe('ProjectedEntity<>', () => {
    describe('single state', () => {
      it('should not return false selection', () => {
        type t = ProjectedEntity<typeof Category, { id: false }>;
        expect<t>({ $state: 'Category', constructor: Category });

        expect<t>({
          $state: 'Category',
          constructor: Category,
          // @ts-expect-error Property 'id' does not exists
          id: undefined,
        });
      });

      it('should return true field selection', () => {
        type t = ProjectedEntity<typeof Category, { id: true }>;
        expect<t>({ $state: 'Category', constructor: Category, id: 123 });

        // @ts-expect-error Property 'id' is missing
        expect<t>({ $state: 'Category', constructor: Category });

        expect<t>({
          $state: 'Category',
          constructor: Category,
          // @ts-expect-error Property 'id' should be number
          id: undefined,
        });
      });

      it('should return maybe boolean field selection', () => {
        type t = ProjectedEntity<typeof Category, { id: boolean }>;

        expect<t>({ $state: 'Category', constructor: Category, id: 123 });
        expect<t>({ $state: 'Category', constructor: Category, id: null });
        expect<t>({ $state: 'Category', constructor: Category });
      });

      it('should throw on invalid selection fields', () => {
        type t = ProjectedEntity<typeof Category, { id: true }>;

        expect<t>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          // @ts-expect-error Property 'name' does not exists
          name: 'str',
        });
      });

      it('should return multiple fields', () => {
        expect<ProjectedEntity<typeof Category, { id: true; name: true }>>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          name: 'str',
        });
      });

      it('should return optional fields', () => {
        type t = ProjectedEntity<
          typeof Category,
          { id: true; description: true }
        >;

        expect<t>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          description: 'str',
        });
        expect<t>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          description: null,
        });
        expect<t>({
          $state: 'Category',
          constructor: Category,
          id: 123,
        });
      });

      it('should select default nested state', () => {
        type t = ProjectedEntity<typeof PublishedPost, { category: true }>;

        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          category: { id: 123 },
        });

        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          // @ts-expect-error Property 'category' should be an object
          category: null,
        });

        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          category: {
            id: 123,
            // @ts-expect-error Property 'name' does not exists
            name: 'foo',
          },
        });
      });

      it('should maybe select default nested state', () => {
        type t = ProjectedEntity<typeof PublishedPost, { category: boolean }>;

        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          category: { id: 123 },
        });

        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          category: null,
        });

        expect<t>({ $state: 'PublishedPost', constructor: PublishedPost });
      });

      it('should select custom nested state', () => {
        type t = ProjectedEntity<
          typeof PublishedPost,
          {
            category: {
              $states: [typeof Category];
              id: true;
              description: true;
            };
          }
        >;

        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          category: { $state: 'Category', constructor: Category, id: 123 },
        });
        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          category: {
            $state: 'Category',
            constructor: Category,
            id: 123,
            description: 'str',
          },
        });
        expect<t>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          category: {
            $state: 'Category',
            constructor: Category,
            id: 123,
            description: null,
          },
        });
      });

      it('should select nested list state', () => {
        type t = ProjectedEntity<
          typeof Category,
          { posts: { $states: typeof Post; id: true; content: true } }
        >;

        expect<t>({
          $state: 'Category',
          constructor: Category,
          posts: [
            {
              $state: 'DraftPost',
              constructor: DraftPost,
              id: 123,
            },
            {
              $state: 'DraftPost',
              constructor: DraftPost,
              id: 123,
              content: 'str',
            },
            {
              $state: 'PublishedPost',
              constructor: PublishedPost,
              id: 123,
              content: 'str',
            },
          ],
        });
      });

      it('should select list with limit', () => {
        expect<
          ProjectedEntity<typeof Category, { posts: { $limit: 0; $offset: 4 } }>
        >({ $state: 'Category', constructor: Category, posts: [] });
      });
    });
  });
});
