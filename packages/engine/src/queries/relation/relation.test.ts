import { Entity } from '@/entity.js';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from '@/generated/__test__/category-post-example.js';
import { Where } from '@/queries/where.js';
import { RelationQuery } from './relation.js';

/* eslint-disable max-lines-per-function */

describe('queries/relation', () => {
  describe('RelationQuery<>', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type R<T> = T extends RelationQuery<any, infer r> ? r : never;

    describe('new ()', () => {
      it('should create from state', () => {
        const rel = new RelationQuery([Category]);

        expect<
          RelationQuery<
            typeof Category,
            Entity<typeof Category>,
            Where<typeof Category>
          >
        >(rel);
      });

      it('should create from states', () => {
        const rel = new RelationQuery([...Post]);

        expect<
          RelationQuery<
            typeof Post[number],
            Entity<typeof Post[number]>,
            Where<typeof Post[number]>
          >
        >(rel);
      });

      it('should create from state', () => {
        const rel = new RelationQuery([]).select({ id: true });
        type t = R<typeof rel>;

        // @ts-expect-error Object should be 'never'
        expect<t>({});
      });
    });

    describe('.select()', () => {
      it('should select state field', () => {
        const rel = new RelationQuery([Category]).select({ name: true });
        type t = R<typeof rel>;

        expect<t>({ $state: 'Category', constructor: Category, name: 'foo' });

        // @ts-expect-error Missing 'name' property
        expect<t>({ $state: 'Category', constructor: Category });
      });

      it('should select state empty fields', () => {
        const rel = new RelationQuery([Category]).select({});
        type t = R<typeof rel>;

        expect<t>({ $state: 'Category', constructor: Category });

        // @ts-expect-error Property 'name' does not exists
        expect<t>({ $state: 'Category', constructor: Category, name: 'foo' });
      });

      it('should throw on select unknown state fields', () => {
        new RelationQuery([Category]).select({
          // @ts-expect-error Property 'foo' does not exists
          foo: true,
        });
      });

      it('should select state empty fields', () => {
        const rel = new RelationQuery([Category]).select({
          name: true as boolean,
        });
        type t = R<typeof rel>;

        expect<t>({ $state: 'Category', constructor: Category });
        expect<t>({ $state: 'Category', constructor: Category, name: 'foo' });
        expect<t>({ $state: 'Category', constructor: Category, name: null });
      });
    });

    describe('.include()', () => {
      it('should throw on unknown relation name', () => {
        // @ts-expect-error 'name' should be 'posts'
        new RelationQuery([Category]).include('name', [Category]);

        // @ts-expect-error 'foo' should be 'category'
        new RelationQuery([...Post]).include('foo', [Category]);
      });

      it('should throw on unknown relation states', () => {
        // @ts-expect-error Category should be a post state
        new RelationQuery([Category]).include('posts', [Category]);

        // @ts-expect-error State 'DraftPost' should be 'Category'
        new RelationQuery([...Post]).include('category', [DraftPost]);
      });

      it('should include relation default fields', () => {
        const rel = new RelationQuery([PublishedPost]).include('category', [
          Category,
        ]);
        type t = R<typeof rel>['category'];

        expect<t>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          name: 'foo',
        });

        // @ts-expect-error Category must be defined
        expect<t>(null);

        // @ts-expect-error Missing 'name' property
        expect<t>({ $state: 'Category', constructor: Category, id: 123 });
      });

      it('should include optional relation default fields', () => {
        const rel = new RelationQuery([...Post]).include('category', [
          Category,
        ]);
        type t = R<typeof rel>['category'];

        expect<t>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          name: 'foo',
        });

        expect<t>(null);

        // @ts-expect-error Missing 'name' property
        expect<t>({ $state: 'Category', constructor: Category, id: 123 });
      });

      it('should include relation selected fields', () => {
        const rel = new RelationQuery([...Post]).include(
          'category',
          [Category],
          (rel) => rel.select({ id: true }),
        );
        type t = R<typeof rel>['category'];

        expect<t>(null);
        expect<t>({ $state: 'Category', constructor: Category, id: 123 });

        expect<t>({
          $state: 'Category',
          constructor: Category,
          id: 123,
          // @ts-expect-error Missing 'name' property
          name: 'foo',
        });
      });

      it('should include relation list', () => {
        const rel = new RelationQuery([Category]).include('posts');
        type t = R<typeof rel>['posts'];

        expect<t>([]);
        expect<t>([
          { $state: 'DraftPost', constructor: DraftPost, id: 123, title: 'd' },
          {
            $state: 'PublishedPost',
            constructor: PublishedPost,
            id: 123,
            title: 'd',
            content: 'ff',
            category: { id: 123 },
            publishedAt: new Date(),
          },
        ]);

        expect<t>([
          {
            // @ts-expect-error Should be post states
            $state: 'Category',
          },
        ]);

        expect<t>([
          // @ts-expect-error missing properties 'category' and 'publishedAt'
          {
            $state: 'PublishedPost',
            constructor: PublishedPost,
            id: 123,
            title: 'd',
            content: 'ff',
          },
        ]);
      });

      it('should include empty relation list', () => {
        const rel = new RelationQuery([Category]).include('posts', []);
        type t = R<typeof rel>['posts'];

        expect<t>([]);

        // @ts-expect-error Object should be 'never'
        expect<t[0]>({});
      });
    });
  });
});
