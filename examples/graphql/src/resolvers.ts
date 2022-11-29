import {
  Category,
  DraftPost,
  engine,
  Post,
  PublishedPost,
} from './states/index.js';
import {
  CategoryPostsArgs,
  MutationCreateCategoryArgs,
  MutationCreatePostArgs,
  MutationDeleteCategoryArgs,
  MutationDeletePostArgs,
  MutationPublishPostArgs,
  MutationUpdateCategoryArgs,
  MutationUpdatePostArgs,
  QueryCategoryArgs,
  QueryPostArgs,
} from './schema.codegen.js';

type P = unknown;

export const resolvers = {
  Category: {
    posts: async (
      { id }: Category,
      { limit, offset }: CategoryPostsArgs,
    ): Promise<PublishedPost[]> =>
      engine
        .findMany(PublishedPost)
        .where({ category: { $eq: { id } } })
        .limit(limit ?? null)
        .offset(offset ?? null),
  },

  Query: {
    category: async (_: P, { id }: QueryCategoryArgs): Promise<Category> =>
      engine.findUniqueOrThrow(Category).unique({ id }),

    categories: async (): Promise<Category[]> =>
      engine.findMany(Category).exec(),

    post: async (_: P, { id }: QueryPostArgs): Promise<Post> =>
      engine.findUniqueOrThrow(...Post).unique({ id }),

    draftPosts: async (): Promise<DraftPost[]> => engine.findMany(DraftPost),
  },

  Mutation: {
    createPost: async (
      _: P,
      { data }: MutationCreatePostArgs,
    ): Promise<DraftPost> =>
      engine
        .createOne([DraftPost], 'create', {
          title: data.title,
          content: data.content,
          category: data.categoryId ? { id: data.categoryId } : null,
        })
        .select(),

    updatePost: async (
      _: P,
      { id, data }: MutationUpdatePostArgs,
    ): Promise<Post> =>
      engine
        .updateUniqueOrThrow([...Post], 'update', {
          title: data.title,
          content: data.content,
          category: { id: data.categoryId },
        })
        .unique({ id })
        .select(),

    publishPost: async (
      _: P,
      { id }: MutationPublishPostArgs,
    ): Promise<PublishedPost> =>
      engine
        .updateUniqueOrThrow([DraftPost], 'publish')
        .unique({ id })
        .select(),

    deletePost: async (_: P, { id }: MutationDeletePostArgs): Promise<void> =>
      engine.deleteUniqueOrThrow([...Post], 'delete').unique({ id }),

    createCategory: async (
      _: P,
      { data }: MutationCreateCategoryArgs,
    ): Promise<Category> =>
      engine.createOne([Category], 'create', data).select(),

    updateCategory: async (
      _: P,
      { id, data }: MutationUpdateCategoryArgs,
    ): Promise<Category> =>
      engine
        .updateUniqueOrThrow([Category], 'update', data)
        .unique({ id })
        .select(),

    deleteCategory: async (
      _: P,
      { id }: MutationDeleteCategoryArgs,
    ): Promise<void> =>
      engine.deleteUniqueOrThrow([Category], 'delete').unique({ id }),
  },
};
