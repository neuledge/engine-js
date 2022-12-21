import { $ } from '@neuledge/engine';
import {
  NumberScalar as Number,
  StringScalar as String,
  DateScalar as Date,
} from '@neuledge/scalars';

/* eslint-disable prefer-arrow-callback, prefer-arrow/prefer-arrow-functions, unicorn/consistent-function-scoping */

/**
 * Basic category
 */
@$.State
export class Category {
  static $name = 'Category' as const;
  static $id = ['+id'] as const;
  static $scalars = {
    id: { type: Number, index: 1 },
    name: { type: String, index: 2 },
    description: { type: String, index: 3, nullable: true },
  };
  static $find = {} as $.Where<{ id: $.WhereNumber<number> }>;
  static $unique = {} as { id: number };
  static $relations = () => ({
    posts: [[...Post]] as const,
  });

  id!: number;
  name!: string;
  description?: string | null;

  static create = Object.assign(
    function ({
      name,
      description,
    }: {
      name: string;
      description?: string | null;
    }): $.Type<typeof Category> {
      return {
        $state: 'Category',
        id: Math.round(Math.random() * 1e6),
        name,
        description,
      };
    },
    { mutation: 'create' } as const,
  );

  static update = Object.assign(
    function (
      this: Category,
      {
        name,
        description,
      }: {
        name: string;
        description?: string | null;
      },
    ): $.Type<typeof Category> {
      return {
        ...this,
        $state: 'Category',
        name: name,
        description: description,
      };
    },
    { mutation: 'update' } as const,
  );

  static delete = Object.assign(
    function (this: Category): void {
      // do nothing
    },
    { mutation: 'delete', virtual: true } as const,
  );
}
export type $Category = $.Entity<typeof Category>;

/**
 * Post in draft state
 */
@$.State
export class DraftPost {
  static $name = 'DraftPost' as const;
  static $id = ['+id'] as const;
  static $scalars = () => ({
    id: { type: Number, index: 1 },
    category: { type: [Category], index: 2, nullable: true },
    title: { type: String, index: 3 },
    content: { type: String, index: 4, nullable: true },
  });
  static $find = {} as $.Where<{ id: $.WhereNumber<number> }>;
  static $unique = {} as { id: number };
  static $relations = () => ({
    category: [Category],
  });
  static $states = () => [PublishedPost];

  id!: number;
  category?: $.Id<typeof Category> | null;
  title!: string;
  content?: string | null;

  static create = Object.assign(
    function ({
      title,
      content,
      category,
    }: {
      title: string;
      content?: string | null;
      category?: $.Id<typeof Category> | null;
    }): $.Type<typeof DraftPost> {
      return {
        $state: 'DraftPost',
        id: Math.round(Math.random() * 1e6),
        title,
        content,
        category,
      };
    },
    { mutation: 'create' } as const,
  );

  static update = Object.assign(
    function (
      this: DraftPost,
      {
        title,
        content,
        category,
      }: {
        title: string;
        content?: string | null;
        category?: $.Id<typeof Category> | null;
      },
    ): $.Type<typeof DraftPost> {
      return {
        ...this,
        $state: 'DraftPost',
        title,
        content,
        category,
      };
    },
    { mutation: 'update' } as const,
  );

  static publish = Object.assign(
    function (this: DraftPost): $.Type<typeof PublishedPost> {
      if (!this.category) {
        throw new TypeError(`Expect category to exists`);
      }
      if (!this.content) {
        throw new TypeError(`Expect content to exists`);
      }

      return {
        ...this,
        $state: 'PublishedPost',
        content: this.content,
        category: this.category,
        publishedAt: new $.Date(),
      };
    },
    { mutation: 'update' } as const,
  );

  static delete = Object.assign(
    function (this: DraftPost): void {
      // do nothing
    },
    { mutation: 'delete', virtual: true } as const,
  );
}
export type $DraftPost = $.Entity<typeof DraftPost>;

/**
 * Post in published state
 */
@$.State
export class PublishedPost {
  static $name = 'PublishedPost' as const;
  static $id = ['+id'] as const;
  static $scalars = () => ({
    id: { type: Number, index: 1 },
    category: { type: [Category], index: 2 },
    title: { type: String, index: 3 },
    content: { type: String, index: 4 },
    publishedAt: { type: Date, index: 5 },
  });
  static $find = {} as $.Where<
    | { id: $.WhereNumber<number> }
    | { category: $.WhereObject<$.Id<typeof Category>> }
  >;
  static $unique = {} as { id: number };
  static $relations = () => ({
    category: [Category],
  });
  static $indexes = {
    'category.posts': ['+category', '+title'] as const,
  };

  id!: number;
  title!: string;
  category!: $.Id<typeof Category>;
  content!: string;
  publishedAt!: Date;

  static update = Object.assign(
    function (
      this: PublishedPost,
      {
        title,
        content,
        category,
      }: { title: string; content: string; category: $.Id<typeof Category> },
    ): $.Type<typeof PublishedPost> {
      return {
        ...this,
        $state: 'PublishedPost',
        title,
        content,
        category,
      };
    },
    { mutation: 'update' } as const,
  );

  static delete = Object.assign(
    function (this: PublishedPost): void {
      // do nothing
    },
    { mutation: 'delete', virtual: true } as const,
  );
}
export type $PublishedPost = $.Entity<typeof PublishedPost>;

export type Post = DraftPost | PublishedPost;
export const Post: $.Either<'Post', typeof DraftPost | typeof PublishedPost> =
  $.either('Post', [DraftPost, PublishedPost]);
export type $Post = $.Entity<typeof Post[number]>;
