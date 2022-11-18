import {
  NumberScalar as Number,
  StringScalar as String,
  DateScalar as Date,
} from '@neuledge/scalars';
import { $ } from '@neuledge/engine';

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
  static $find: $.Where<{ id: $.WhereNumber<number> }>;
  static $unique: {
    id: number;
  };
  // static $relations = () => ({
  //   posts: [[...Post]] as const,
  // });

  id!: number;
  name!: string;
  description?: string | null;

  static create({
    name,
    description,
  }: {
    name: string;
    description?: string | null;
  }): $.Entity<typeof Category> {
    return {
      $state: 'Category',
      id: Math.round(Math.random() * 1e6),
      name,
      description,
    };
  }

  static update(
    this: Category,
    {
      name,
      description,
    }: {
      name: string;
      description?: string | null;
    },
  ): $.Entity<typeof Category> {
    return {
      ...this,
      $state: 'Category',
      name: name,
      description: description,
    };
  }

  static delete(this: Category): void {
    // do nothing
  }
}

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
  static $find: $.Where<{ id: $.WhereNumber<number> }>;
  static $unique: {
    id: number;
  };
  static $relations = () => ({
    category: [Category],
  });
  static $states = () => [PublishedPost];

  id!: number;
  category?: $.Id<typeof Category> | null;
  title!: string;
  content?: string | null;

  static create({
    title,
    content,
    category,
  }: {
    title: string;
    content?: string | null;
    category?: $.Id<typeof Category> | null;
  }): $.Entity<typeof DraftPost> {
    return {
      $state: 'DraftPost',
      id: Math.round(Math.random() * 1e6),
      title,
      content,
      category,
    };
  }

  static update(
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
  ): $.Entity<typeof DraftPost> {
    return {
      ...this,
      $state: 'DraftPost',
      title,
      content,
      category,
    };
  }

  static publish(this: DraftPost): $.Entity<typeof PublishedPost> {
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
  }

  static delete(this: DraftPost): void {
    // do nothing
  }
}

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
  static $find: $.Where<
    | { id: $.WhereNumber<number> }
    | { category: $.WhereObject<$.Id<typeof Category>> }
  >;
  static $unique: {
    id: number;
  };
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

  static update(
    this: PublishedPost,
    {
      title,
      content,
      category,
    }: { title: string; content: string; category: $.Id<typeof Category> },
  ): $.Entity<typeof PublishedPost> {
    return {
      ...this,
      $state: 'PublishedPost',
      title,
      content,
      category,
    };
  }

  static delete(this: PublishedPost): void {
    // do nothing
  }
}

export type Post = DraftPost | PublishedPost;
export const Post = $.either('Post', [DraftPost, PublishedPost]);
