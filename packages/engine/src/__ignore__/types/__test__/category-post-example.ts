import {
  StateEntity as $,
  StateId as $id,
  // StateInnerSelect as $select,
  // StateInnerSelectList as $selectList,
  // EntityList as $list,
} from '@neuledge/engine';

/**
 * Basic category
 */
export class Category {
  static $key = 'Category' as const;
  static $id: { id: number };
  static $find: {
    id?: number;
  };
  static $unique: {
    id: number;
  };
  // static $projection: {
  //   id: number;
  //   name: string;
  //   description?: string | null;
  //   posts: $list<typeof Post[number]['$projection']>;
  // };
  // static $select: {
  //   id?: boolean;
  //   name?: boolean;
  //   description?: boolean;
  //   posts?: $selectList<typeof Post[number]>;
  // };
  static $relations = () => ({
    posts: [[...Post]] as const,
  });

  id!: number;
  name!: string;
  description?: string | null;

  static createCategory({
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
export class DraftPost {
  static $key = 'DraftPost' as const;
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
  // static $projection: {
  //   id: number;
  //   category?: typeof Category['$projection'] | null;
  //   title: string;
  //   content?: string | null;
  // };
  // static $select: {
  //   id?: boolean;
  //   category?: $select<typeof Category> | boolean;
  //   title?: boolean;
  //   content?: boolean;
  // };

  id!: number;
  category?: $id<typeof Category> | null;
  title!: string;
  content?: string | null;

  static createPost({
    title,
    content,
    category,
  }: {
    title: string;
    content?: string | null;
    category: $id<typeof Category>;
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
      category: $id<typeof Category>;
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
export class PublishedPost {
  static $key = 'PublishedPost' as const;
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
  // static $projection: {
  //   id: number;
  //   category: typeof Category['$projection'];
  //   title: string;
  //   content: string;
  //   publishedAt: Date;
  // };
  // static $select: {
  //   id?: boolean;
  //   category?: $select<typeof Category> | boolean;
  //   title?: boolean;
  //   content?: boolean;
  //   publishedAt?: boolean;
  // };

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
export const Post = [DraftPost, PublishedPost] as const;
