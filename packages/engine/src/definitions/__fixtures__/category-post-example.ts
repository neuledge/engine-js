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
@$.State<'Category', Category>()
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

  static create = $.createMutation<
    typeof Category,
    {
      name: string;
      description?: string | null;
    }
  >('create', function ({ name, description }) {
    return {
      $state: 'Category',
      id: Math.round(Math.random() * 1e6),
      name,
      description,
    };
  });

  static update = $.createMutation<
    typeof Category,
    {
      name: string;
      description?: string | null;
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

  static delete = $.createMutation<typeof Category>('delete');
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

  static create = $.createMutation<
    typeof DraftPost,
    {
      title: string;
      content?: string | null;
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

  static update = $.createMutation<
    typeof DraftPost,
    {
      title: string;
      content?: string | null;
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

  static publish = $.createMutation<typeof DraftPost, typeof PublishedPost>(
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

  static delete = $.createMutation('delete');
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

  static update = $.createMutation<
    typeof PublishedPost,
    { title: string; content: string; category: $.Id<typeof Category> },
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

  static delete = $.createMutation<typeof PublishedPost>('delete');
}
export type $PublishedPost = $.Entity<typeof PublishedPost>;

export type Post = DraftPost | PublishedPost;
export const Post: $.Either<'Post', typeof DraftPost | typeof PublishedPost> =
  $.either('Post', [DraftPost, PublishedPost]);
export type $Post = $.Entity<typeof Post[number]>;
