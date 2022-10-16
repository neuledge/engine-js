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
      engine.findMany({
        states: [PublishedPost],
        // where: { categoryId: id },
        limit,
        offset,
      }),
  },

  Query: {
    category: async (_: P, { id }: QueryCategoryArgs): Promise<Category> =>
      engine.findUniqueOrThrow({ states: [Category], where: { id } }),

    categories: async (): Promise<Category[]> =>
      engine.findMany({ states: [Category] }),

    post: async (_: P, { id }: QueryPostArgs): Promise<Post> =>
      engine.findUniqueOrThrow({
        states: [...Post],
        where: { id },
      }),

    draftPosts: async (): Promise<DraftPost[]> =>
      engine.findMany({ states: [DraftPost] }),
  },

  Mutation: {
    createPost: async (
      _: P,
      { data }: MutationCreatePostArgs,
    ): Promise<DraftPost> =>
      engine.createOne({
        state: DraftPost,
        action: 'createPost',
        arguments: data,
      }),

    updatePost: async (
      _: P,
      { id, data }: MutationUpdatePostArgs,
    ): Promise<Post> =>
      engine.mutateUniqueOrThrow({
        states: [...Post],
        where: { id },
        action: 'update',
        arguments: data,
        select: true,
      }),

    publishPost: async (
      _: P,
      { id }: MutationPublishPostArgs,
    ): Promise<PublishedPost> =>
      engine.mutateUniqueOrThrow({
        states: [DraftPost],
        where: { id },
        action: 'publish',
        arguments: {},
        select: true,
      }),

    deletePost: async (_: P, { id }: MutationDeletePostArgs): Promise<void> =>
      engine.mutateUniqueOrThrow({
        states: [...Post],
        where: { id },
        action: 'delete',
        arguments: {},
      }),

    createCategory: async (
      _: P,
      { data }: MutationCreateCategoryArgs,
    ): Promise<Category> =>
      engine.createOne({
        state: Category,
        action: 'createCategory',
        arguments: data,
      }),

    updateCategory: async (
      _: P,
      { id, data }: MutationUpdateCategoryArgs,
    ): Promise<Category> =>
      engine.mutateUniqueOrThrow({
        states: [Category],
        where: { id },
        action: 'update',
        arguments: data,
        select: true,
      }),

    deleteCategory: async (
      _: P,
      { id }: MutationDeleteCategoryArgs,
    ): Promise<void> =>
      engine.mutateUniqueOrThrow({
        states: [Category],
        where: { id },
        action: 'delete',
        arguments: {},
      }),
  },
};
