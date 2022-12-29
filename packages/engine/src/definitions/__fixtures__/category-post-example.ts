import { $ } from '@neuledge/engine';
import {
  NumberScalar as Number,
  StringScalar as String,
  DateTimeScalar as DateTime,
} from '@neuledge/scalars';

/* eslint-disable @typescript-eslint/ban-types, prefer-arrow-callback, prefer-arrow/prefer-arrow-functions, unicorn/consistent-function-scoping */

/**
 * Basic category
 */
@$.State<'Category', Category>()
export class Category {
  static $name = 'Category' as const;
  static $id = ['+id'] as const;
  static $scalars = {
    id: { type: Number, index: 1 },
    name: { type: String, index: 2 },
    description: { type: String, index: 3, nullable: true },
  };
  static $find: $.Where<{ id: $.WhereNumber<Number> }>;
  static $unique: { id: Number };
  static $relations = () => ({
    posts: [[...Post]] as const,
  });

  id!: Number;
  name!: String;
  description?: String | null;

  static create = $.mutation<
    typeof Category,
    {
      name: String;
      description?: String | null;
    }
  >('create', function ({ name, description }) {
    return {
      $state: 'Category',
      id: Math.round(Math.random() * 1e6),
      name,
      description,
    };
  });

  static update = $.mutation<
    typeof Category,
    {
      name: String;
      description?: String | null;
    },
    typeof Category
  >('update', function ({ name, description }) {
    return {
      ...this,
      $state: 'Category',
      name: name,
      description: description,
    };
  });

  static delete = $.mutation<typeof Category>('delete');
}
export type $Category = $.Entity<typeof Category>;

/**
 * Post in draft state
 */
@$.State<'DraftPost', DraftPost>()
export class DraftPost {
  static $name = 'DraftPost' as const;
  static $id = ['+id'] as const;
  static $scalars = () => ({
    id: { type: Number, index: 1 },
    category: { type: [Category], index: 2, nullable: true },
    title: { type: String, index: 3 },
    content: { type: String, index: 4, nullable: true },
  });
  static $find: $.Where<{ id: $.WhereNumber<Number> }>;
  static $unique: { id: Number };
  static $relations = () => ({
    category: [Category],
  });
  static $states = () => [PublishedPost];

  id!: Number;
  category?: $.Id<typeof Category> | null;
  title!: String;
  content?: String | null;

  static create = $.mutation<
    typeof DraftPost,
    {
      title: String;
      content?: String | null;
      category?: $.Id<typeof Category> | null;
    }
  >('create', function ({ title, content, category }) {
    return {
      $state: 'DraftPost',
      id: Math.round(Math.random() * 1e6),
      title,
      content,
      category,
    };
  });

  static update = $.mutation<
    typeof DraftPost,
    {
      title: String;
      content?: String | null;
      category?: $.Id<typeof Category> | null;
    },
    typeof DraftPost
  >('update', function ({ title, content, category }) {
    return {
      ...this,
      $state: 'DraftPost',
      title,
      content,
      category,
    };
  });

  static publish = $.mutation<typeof DraftPost, typeof PublishedPost>(
    'update',
    function () {
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
  );

  static delete = $.mutation('delete');
}
export type $DraftPost = $.Entity<typeof DraftPost>;

/**
 * Post in published state
 */
@$.State<'PublishedPost', PublishedPost>()
export class PublishedPost {
  static $name = 'PublishedPost' as const;
  static $id = ['+id'] as const;
  static $scalars = () => ({
    id: { type: Number, index: 1 },
    category: { type: [Category], index: 2 },
    title: { type: String, index: 3 },
    content: { type: String, index: 4 },
    publishedAt: { type: DateTime, index: 5 },
  });
  static $find: $.Where<
    { id: $.WhereNumber<Number> } | { category: $.WhereState<typeof Category> }
  >;
  static $unique: { id: Number };
  static $relations = () => ({
    category: [Category],
  });
  static $indexes = {
    'category.posts': ['+category', '+title'] as const,
  };

  id!: Number;
  title!: String;
  category!: $.Id<typeof Category>;
  content!: String;
  publishedAt!: DateTime;

  static update = $.mutation<
    typeof PublishedPost,
    { title: String; content: String; category: $.Id<typeof Category> },
    typeof PublishedPost
  >('update', function ({ title, content, category }) {
    return {
      ...this,
      $state: 'PublishedPost',
      title,
      content,
      category,
    };
  });

  static delete = $.mutation<typeof PublishedPost>('delete');
}
export type $PublishedPost = $.Entity<typeof PublishedPost>;

export type Post = DraftPost | PublishedPost;
export const Post: $.Either<'Post', typeof DraftPost | typeof PublishedPost> =
  $.either('Post', [DraftPost, PublishedPost]);
export type $Post = $.Entity<typeof Post[number]>;
