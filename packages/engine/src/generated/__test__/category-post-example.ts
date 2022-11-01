import {
  NumberScalar as Number,
  StringScalar as String,
} from '@neuledge/scalars';
import {
  Entity as $,
  StateDefinition as $State,
  StateId as $id,
} from '@neuledge/engine';

/**
 * Basic category
 */
@$State
export class Category {
  static $key = 'Category' as const;
  static $scalars = {
    id: { type: Number, index: 1 },
    name: { type: String, index: 2 },
    description: { type: String, index: 3, nullable: true },
  };
  static $id: { id: number };
  static $find: {
    id?: number;
  };
  static $unique: {
    id: number;
  };
  static $relations = () => ({
    posts: [[...Post]] as const,
  });
  static $methods = {};

  id!: number;
  name!: string;
  description?: string | null;

  static create({
    name,
    description,
  }: {
    name: string;
    description?: string | null;
  }): $<typeof Category> {
    return {
      $state: 'Category',
      constructor: Category,
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
  ): $<typeof Category> {
    return {
      ...this,
      $state: 'Category',
      constructor: Category,
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
@$State
export class DraftPost {
  static $key = 'DraftPost' as const;
  static $scalars = {
    id: { type: Number, index: 1 },
    category: { type: [Category], index: 2, nullable: true },
    title: { type: String, index: 3 },
    content: { type: String, index: 4, nullable: true },
  };
  static $id: { id: number };
  static $find: {
    id?: number;
  };
  static $unique: {
    id: number;
  };
  static $relations = () => ({
    category: [Category],
  });
  static $methods = () => ({
    publish: [PublishedPost],
  });

  id!: number;
  category?: $id<typeof Category> | null;
  title!: string;
  content?: string | null;

  static create({
    title,
    content,
    category,
  }: {
    title: string;
    content?: string | null;
    category?: $id<typeof Category> | null;
  }): $<typeof DraftPost> {
    return {
      $state: 'DraftPost',
      constructor: DraftPost,
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
      category?: $id<typeof Category> | null;
    },
  ): $<typeof DraftPost> {
    return {
      ...this,
      $state: 'DraftPost',
      constructor: DraftPost,
      title,
      content,
      category,
    };
  }

  static publish(this: DraftPost): $<typeof PublishedPost> {
    if (!this.category) {
      throw new TypeError(`Expect category to exists`);
    }
    if (!this.content) {
      throw new TypeError(`Expect content to exists`);
    }

    return {
      ...this,
      $state: 'PublishedPost',
      constructor: PublishedPost,
      content: this.content,
      category: this.category,
      publishedAt: new Date(),
    };
  }

  static delete(this: DraftPost): void {
    // do nothing
  }
}

/**
 * Post in published state
 */
@$State
export class PublishedPost {
  static $key = 'PublishedPost' as const;
  static $scalars = {
    id: { type: Number, index: 1 },
    category: { type: [Category], index: 2 },
    title: { type: String, index: 3 },
    content: { type: String, index: 4 },
  };
  static $id: { id: number };
  static $find:
    | {
        id?: number;
      }
    | { category?: $id<typeof Category> };
  static $unique: {
    id: number;
  };
  static $relations = () => ({
    category: [Category],
  });
  static $methods = {};

  id!: number;
  title!: string;
  category!: $id<typeof Category>;
  content!: string;
  publishedAt!: Date;

  static update(
    this: PublishedPost,
    {
      title,
      content,
      category,
    }: { title: string; content: string; category: $id<typeof Category> },
  ): $<typeof PublishedPost> {
    return {
      ...this,
      $state: 'PublishedPost',
      constructor: PublishedPost,
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
export const Post = Object.assign([DraftPost, PublishedPost], { $key: 'Post' });
