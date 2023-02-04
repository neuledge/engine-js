import { Category, DraftPost, Post, PublishedPost } from './states.codegen';
import { Resolvers } from './schema.codegen';
import { engine } from './engine';

export const resolvers: Resolvers = {
  Category: {
    posts: async ({ id }, { limit, offset }) =>
      engine
        .findMany(PublishedPost)
        .where({ category: { $eq: { id } } })
        .limit(limit ?? null)
        .offset(offset ?? null),
  },

  Post: {
    __resolveType: ({ $state }) => $state,
  },

  DraftPost: {
    category: async ({ category }) =>
      category
        ? engine.findUniqueOrThrow(Category).unique({ id: category.id })
        : null,
  },

  PublishedPost: {
    category: async ({ category }) =>
      engine.findUniqueOrThrow(Category).unique({ id: category.id }),
  },

  Query: {
    category: async (_, { id }) =>
      engine.findUniqueOrThrow(Category).unique({ id }),

    categories: async () => engine.findMany(Category),

    post: async (_, { id }) => engine.findUniqueOrThrow(...Post).unique({ id }),

    draftPosts: async () => engine.findMany(DraftPost),
  },

  Mutation: {
    createPost: async (_, { data }) =>
      engine
        .initOne(DraftPost)
        .create({
          title: data.title,
          content: data.content,
          category: data.categoryId ? { id: data.categoryId } : null,
        })
        .return(),

    updatePost: async (_, { id, data }) =>
      engine
        .alterUniqueOrThrow(...Post)
        .update({
          title: data.title,
          content: data.content,
          category: { id: data.categoryId },
        })
        .unique({ id })
        .return(),

    publishPost: async (_, { id }) =>
      engine.alterUniqueOrThrow(DraftPost).publish().unique({ id }).return(),

    deletePost: async (_, { id }) =>
      engine
        .alterUniqueOrThrow(...Post)
        .delete()
        .unique({ id })
        .then(() => null),

    createCategory: async (_, { data }) =>
      engine.initOne(Category).create(data).return(),

    updateCategory: async (_, { id, data }) =>
      engine.alterUniqueOrThrow(Category).update(data).unique({ id }).return(),

    deleteCategory: async (_, { id }) =>
      engine
        .alterUniqueOrThrow(Category)
        .delete()
        .unique({ id })
        .then(() => null),
  },
};
