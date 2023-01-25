import { $ } from '@neuledge/engine';

/* eslint-disable @typescript-eslint/ban-types, prefer-arrow-callback, prefer-arrow/prefer-arrow-functions, unicorn/consistent-function-scoping */

/**
 * A posts category
 */
@$.State<'Category', Category>()
export class Category {
  static $name = 'Category' as const;
  static $id = { fields: ['+id'], auto: 'increment' } as const;
  static $scalars = () => ({
    id: { type: $.scalars.Number, index: 1 },
    name: { type: $.scalars.String, index: 2 },
    description: { type: $.scalars.String, index: 3, nullable: true },
  });
  static $find: $.Where<{
    id?: $.WhereNumber<$.scalars.Number>;
  }>;
  static $unique: {
    id: $.scalars.Number;
  };
  static $relations = () => ({
    posts: [[...Post]] as const,
  });

  id!: $.scalars.Number;
  name!: $.scalars.String;
  description?: $.scalars.String | null;

  /**
   * Create a new category
   */
  static create = $.mutation<
    typeof Category,
    {
      name: $.scalars.String;
      description?: $.scalars.String | null;
    }
  >('create', async function ({ name, description }) {
    return {
      $state: 'Category',
      id: null,
      name,
      description,
    };
  });

  /**
   * Update the category details
   */
  static update = $.mutation<
    typeof Category,
    {
      name: $.scalars.String;
      description?: $.scalars.String | null;
    },
    typeof Category
  >('update', async function ({ name, description }) {
    return {
      ...this,
      $state: 'Category',
      name,
      description,
    };
  });

  /**
   * Delete the category and all it's related posts
   */
  static delete = $.mutation<typeof Category>('delete');
}
export type $Category = $.Entity<typeof Category>;

/**
 * An unpublished post
 */
@$.State<'DraftPost', DraftPost>()
export class DraftPost {
  static $name = 'DraftPost' as const;
  static $id = { fields: ['+id'], auto: 'increment' } as const;
  static $scalars = () => ({
    id: { type: $.scalars.Number, index: 1 },
    category: { type: [Category], index: 2, nullable: true },
    title: { type: $.scalars.String, index: 3 },
    content: { type: $.scalars.String, index: 4, nullable: true },
  });
  static $find: $.Where<{
    id?: $.WhereNumber<$.scalars.Number>;
  }>;
  static $unique: {
    id: $.scalars.Number;
  };
  static $relations = () => ({
    category: [Category] as const,
  });
  static $transforms = () => [PublishedPost];

  id!: $.scalars.Number;
  category?: $.Id<typeof Category> | null;
  title!: $.scalars.String;
  content?: $.scalars.String | null;

  /**
   * Create a new draft post
   */
  static create = $.mutation<
    typeof DraftPost,
    {
      title: $.scalars.String;
      content?: $.scalars.String | null;
      category?: $.Id<typeof Category> | null;
    }
  >('create', async function ({ title, content, category }) {
    return {
      $state: 'DraftPost',
      id: null,
      category,
      title,
      content,
    };
  });

  /**
   * Update a draft post
   */
  static update = $.mutation<
    typeof DraftPost,
    {
      title: $.scalars.String;
      content?: $.scalars.String | null;
      category?: $.Id<typeof Category> | null;
    },
    typeof DraftPost
  >('update', async function ({ title, content, category }) {
    return {
      ...this,
      $state: 'DraftPost',
      title,
      content,
      category,
    };
  });

  /**
   * Publish a draft post
   */
  static publish = $.mutation<typeof DraftPost, typeof PublishedPost>(
    'update',
    async function () {
      return {
        ...this,
        $state: 'PublishedPost',
        content: await $.runtime.Required({ value: this.content }),
        category: await $.runtime.Required({ value: this.category }),
        publishedAt: await $.runtime.DateTime({}),
      };
    },
  );

  /**
   * Delete a post
   */
  static delete = $.mutation<typeof DraftPost>('delete');
}
export type $DraftPost = $.Entity<typeof DraftPost>;

/**
 * A published post
 */
@$.State<'PublishedPost', PublishedPost>()
export class PublishedPost {
  static $name = 'PublishedPost' as const;
  static $id = { fields: ['+id'], auto: 'increment' } as const;
  static $scalars = () => ({
    id: { type: $.scalars.Number, index: 256 },
    title: { type: $.scalars.String, index: 258 },
    category: { type: [Category], index: 1 },
    content: { type: $.scalars.String, index: 2 },
    publishedAt: { type: $.scalars.DateTime, index: 3 },
  });
  static $find: $.Where<
    | {
        category?: $.WhereState<typeof Category>;
      }
    | {
        category: $.WhereState<typeof Category>;
        title?: $.WhereString<$.scalars.String>;
      }
    | {
        id?: $.WhereNumber<$.scalars.Number>;
      }
  >;
  static $unique: {
    id: $.scalars.Number;
  };
  static $relations = () => ({
    category: [Category] as const,
  });
  static $indexes = {
    category_title: ['+category', '+title'] as const,
  };

  id!: $.scalars.Number;
  title!: $.scalars.String;
  category!: $.Id<typeof Category>;
  content!: $.scalars.String;
  publishedAt!: $.scalars.DateTime;

  /**
   * Update a published post
   */
  static update = $.mutation<
    typeof PublishedPost,
    {
      title: $.scalars.String;
      content: $.scalars.String;
      category: $.Id<typeof Category>;
    },
    typeof PublishedPost
  >('update', async function ({ title, content, category }) {
    return {
      ...this,
      $state: 'PublishedPost',
      title,
      content,
      category,
    };
  });

  /**
   * Delete a post
   */
  static delete = $.mutation<typeof PublishedPost>('delete');
}
export type $PublishedPost = $.Entity<typeof PublishedPost>;

export type Post = DraftPost | PublishedPost;
export const Post: $.Either<'Post', typeof DraftPost | typeof PublishedPost> =
  $.either('Post', [DraftPost, PublishedPost]);
export type $Post = $.Entity<typeof Post[number]>;
