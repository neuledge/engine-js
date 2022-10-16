import { Entity, ProjectedEntity } from './entity.js';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from './__test__/category-post-example.js';

/* eslint-disable max-lines-per-function */

describe('types/entity', () => {
  describe('Entity<>', () => {
    describe('single state', () => {
      it('should accept state with missing optional fields', () => {
        expect<Entity<typeof Category>>({
          $state: 'Category',
          constructor: Category,
          id: 1,
          name: 'str',
        });
      });

      it('should accept state with provided optional fields', () => {
        expect<Entity<typeof Category>>({
          $state: 'Category',
          constructor: Category,
          id: 1,
          name: 'str',
          description: 'foo bar',
        });
      });

      it('should throw on missing field', () => {
        // @ts-expect-error Property 'name' is missing
        expect<Entity<typeof Category>>({
          $state: 'Category',
          constructor: Category,
          id: 1,
          description: 'foo bar',
        });
      });

      it('should throw on unknown field', () => {
        expect<Entity<typeof Category>>({
          $state: 'Category',
          constructor: Category,
          id: 1,
          name: 'str',
          // @ts-expect-error Property 'foo' does not exist
          foo: 'foo bar',
        });
      });
    });

    describe('multiple states', () => {
      it('should accept different states with missing optional fields', () => {
        expect<Entity<typeof Post[number]>>({
          $state: 'DraftPost',
          constructor: DraftPost,
          id: 1,
          title: 'str',
        });
      });

      expect<Entity<typeof Post[number]>>({
        $state: 'PublishedPost',
        constructor: PublishedPost,
        id: 1,
        title: 'str',
        content: 'content',
        category: { id: 123 },
      });

      it('should throw on missing field', () => {
        // @ts-expect-error Property 'title' is missing
        expect<Entity<typeof Post[number]>>({
          $state: 'DraftPost',
          constructor: DraftPost,
          id: 1,
        });

        // @ts-expect-error Property 'category' is missing
        expect<Entity<typeof Post[number]>>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          id: 1,
          title: 'str',
          content: 'content',
        });
      });

      it('should throw on unknown field', () => {
        expect<Entity<typeof Post[number]>>({
          $state: 'DraftPost',
          constructor: DraftPost,
          id: 1,
          title: 'str',
          // @ts-expect-error Property 'foo' does not exist
          foo: 'foo bar',
        });

        expect<Entity<typeof Post[number]>>({
          $state: 'PublishedPost',
          constructor: PublishedPost,
          id: 1,
          title: 'str',
          content: 'content',
          category: { id: 123 },
          // @ts-expect-error Property 'foo' does not exist
          foo: 'foo bar',
        });
      });
    });
  });

  describe('ProjectedEntity<>', () => {
    describe('single state', () => {
      it('should not return false selection', () => {
        expect<ProjectedEntity<typeof Category, { id: false }>>({
          $state: 'Category',
          constructor: Category,
        });
      });

      it('should return true field selection', () => {
        expect<ProjectedEntity<typeof Category, { id: true }>>({
          $state: 'Category',
          constructor: Category,
          id: 123,
        });
      });

      it('should return maybe boolean field selection', () => {
        type t = ProjectedEntity<typeof Category, { id: boolean }>;

        expect<t>({ $state: 'Category', constructor: Category, id: 123 });
        expect<t>({ $state: 'Category', constructor: Category, id: null });
        expect<t>({ $state: 'Category', constructor: Category });
      });

      it('should throw on invalid selection fields', () => {
        expect<ProjectedEntity<typeof Category, { id: true }>>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          // @ts-expect-error Property 'name' does not exists
          name: 'str',
        });
      });

      it('should return multiple fields ', () => {
        expect<ProjectedEntity<typeof Category, { id: true; name: true }>>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          name: 'str',
        });
      });

      it('should return optional fields ', () => {
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

      it('should select nested state', () => {
        type t = ProjectedEntity<
          typeof PublishedPost,
          { category: { id: true; description: true } }
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
          { posts: { id: true; content: true } }
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
