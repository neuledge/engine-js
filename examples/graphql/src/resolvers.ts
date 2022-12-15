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
        .createOne(DraftPost, 'create', {
          title: data.title,
          content: data.content,
          category: data.categoryId ? { id: data.categoryId } : null,
        })
        .select(),

    updatePost: async (_, { id, data }) =>
      engine
        .updateUniqueOrThrow([...Post], 'update', {
          title: data.title,
          content: data.content,
          category: { id: data.categoryId },
        })
        .unique({ id })
        .select(),

    publishPost: async (_, { id }) =>
      engine
        .updateUniqueOrThrow([DraftPost], 'publish')
        .unique({ id })
        .select(),

    deletePost: async (_, { id }) =>
      engine
        .deleteUniqueOrThrow([...Post], 'delete')
        .unique({ id })
        .then(() => null),

    createCategory: async (_, { data }) =>
      engine.createOne(Category, 'create', data).select(),

    updateCategory: async (_, { id, data }) =>
      engine
        .updateUniqueOrThrow([Category], 'update', data)
        .unique({ id })
        .select(),

    deleteCategory: async (_, { id }) =>
      engine
        .deleteUniqueOrThrow([Category], 'delete')
        .unique({ id })
        .then(() => null),
  },
};
