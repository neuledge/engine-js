import { Entity, ProjectedEntity } from './entity.js';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from './generated/__test__/category-post-example.js';

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
        publishedAt: new Date(),
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

      it('should select scalar nested state', () => {
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

      it('should maybe select default scalar nested state', () => {
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
    });
  });
});