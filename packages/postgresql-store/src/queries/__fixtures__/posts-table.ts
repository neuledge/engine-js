import { StoreCollection, StoreDocument } from '@neuledge/store';

export const postsTableName = 'posts';

export const postsCollection: StoreCollection = {
  name: postsTableName,
  fields: {
    id: {
      name: 'id',
      type: 'number',
      nullable: false,
      size: null,
      precision: 32,
      scale: 0,
    },
    author_id: {
      name: 'author_id',
      type: 'number',
      nullable: false,
      size: null,
      precision: 32,
      scale: 0,
    },
    title: {
      name: 'title',
      type: 'string',
      nullable: false,
      size: 100,
      precision: null,
      scale: null,
    },
    body: {
      name: 'body',
      type: 'string',
      nullable: false,
      size: 1000,
      precision: null,
      scale: null,
    },
    created_at: {
      name: 'created_at',
      type: 'date-time',
      nullable: false,
      size: null,
      precision: null,
      scale: null,
    },
    updated_at: {
      name: 'updated_at',
      type: 'date-time',
      nullable: false,
      size: null,
      precision: null,
      scale: null,
    },
  },
  primaryKey: {
    name: 'id',
    fields: { id: { sort: 'asc' } },
    unique: 'primary',
    auto: 'increment',
  },
  indexes: {
    id: {
      name: 'id',
      fields: { id: { sort: 'asc' } },
      unique: 'primary',
      auto: 'increment',
    },
    posts_author_id_index: {
      name: 'posts_author_id_index',
      fields: { author_id: { sort: 'asc' } },
      unique: false,
    },
  },
};

export const postsTableRow1: StoreDocument = {
  id: 1,
  author_id: 1,
  title: 'Post 1',
  body: 'Post 1 body',
  created_at: new Date('2020-01-01T00:00:00.000Z'),
  updated_at: new Date('2020-01-01T00:00:00.000Z'),
};
