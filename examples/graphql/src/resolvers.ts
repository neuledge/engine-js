import { Category, DraftPost, Post, PublishedPost } from './states/states.js';
import { engine } from './states/engine.js';
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
        .findUniqueOrThrow(Category)
        .where({ id })
        .include('posts', [PublishedPost], (rel) =>
          rel.limit(limit).offset(offset),
        )
        .then((res) => res.posts),
  },

  Query: {
    category: async (_: P, { id }: QueryCategoryArgs): Promise<Category> =>
      engine.findUniqueOrThrow(Category).where({ id }),

    categories: async (): Promise<Category[]> =>
      engine.findMany(Category).exec(),

    post: async (_: P, { id }: QueryPostArgs): Promise<Post> =>
      engine.findUniqueOrThrow(...Post).where({ id }),

    draftPosts: async (): Promise<DraftPost[]> => engine.findMany(DraftPost),
  },

  Mutation: {
    createPost: async (
      _: P,
      { data }: MutationCreatePostArgs,
    ): Promise<DraftPost> =>
      engine.mutateOneOrThrow([DraftPost], 'create', data).select(),

    updatePost: async (
      _: P,
      { id, data }: MutationUpdatePostArgs,
    ): Promise<Post> =>
      engine
        .mutateOneOrThrow([...Post], 'update', data)
        .where({ id })
        .select(),

    publishPost: async (
      _: P,
      { id }: MutationPublishPostArgs,
    ): Promise<PublishedPost> =>
      engine.mutateUniqueOrThrow([DraftPost], 'publish').where({ id }).select(),

    deletePost: async (_: P, { id }: MutationDeletePostArgs): Promise<void> =>
      engine.mutateUniqueOrThrow([...Post], 'delete').where({ id }),

    createCategory: async (
      _: P,
      { data }: MutationCreateCategoryArgs,
    ): Promise<Category> =>
      engine.mutateOneOrThrow([Category], 'create', data).select(),

    updateCategory: async (
      _: P,
      { id, data }: MutationUpdateCategoryArgs,
    ): Promise<Category> =>
      engine
        .mutateUniqueOrThrow([Category], 'update', data)
        .where({ id })
        .select(),

    deleteCategory: async (
      _: P,
      { id }: MutationDeleteCategoryArgs,
    ): Promise<void> =>
      engine.mutateUniqueOrThrow([Category], 'delete').where({ id }),
  },
};
