import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata, MetadataCollection } from '@/metadata';
import {
  convertJoinSelectQuery,
  convertLeftJoinSelectQuery,
  convertSelectQuery,
} from './select';

/* eslint-disable max-lines-per-function */

describe('engine/retrive/select', () => {
  let postsCollection: MetadataCollection;

  beforeAll(() => {
    const metadata = new Metadata([Category, ...Post]);

    postsCollection = metadata.getCollections(Post)[0];
  });

  describe('convertSelectQuery()', () => {
    it('should convert an empty object', () => {
      const res = convertSelectQuery(postsCollection, {});

      expect(res).toEqual({});
    });

    it('should ignore select enabled', () => {
      const res = convertSelectQuery(postsCollection, {
        select: true,
      });

      expect(res).toEqual({});
    });

    it('should convert a select object', () => {
      const res = convertSelectQuery(postsCollection, {
        select: {
          title: true,
          id: true,
          content: false,
        },
      });

      expect(res).toEqual({
        select: {
          __h: true,
          __v: true,
          title: true,
          id: true,
        },
      });
    });

    it('should ignore unknown fields', () => {
      const res = convertSelectQuery(postsCollection, {
        select: {
          title: false,
          id: true,
          foo: true,
        },
      });

      expect(res).toEqual({
        select: {
          __h: true,
          __v: true,
          id: true,
        },
      });
    });
  });

  describe('convertJoinSelectQuery()', () => {
    it('should convert an empty object', () => {
      const res = convertJoinSelectQuery(postsCollection, {});

      expect(res).toEqual({});
    });

    it('should convert select enabled', () => {
      const res = convertJoinSelectQuery(postsCollection, {
        select: true,
      });

      expect(res).toEqual({
        select: true,
      });
    });

    it('should convert a select object', () => {
      const res = convertJoinSelectQuery(postsCollection, {
        select: {
          title: true,
          id: true,
          content: false,
        },
      });

      expect(res).toEqual({
        select: {
          __h: true,
          __v: true,
          title: true,
          id: true,
        },
      });
    });
  });

  describe('convertLeftJoinSelectQuery()', () => {
    it('should convert an empty object', () => {
      const res = convertLeftJoinSelectQuery(postsCollection, {});

      expect(res).toEqual({
        select: true,
      });
    });

    it('should convert select enabled', () => {
      const res = convertLeftJoinSelectQuery(postsCollection, {
        select: true,
      });

      expect(res).toEqual({
        select: true,
      });
    });

    it('should convert a select object', () => {
      const res = convertLeftJoinSelectQuery(postsCollection, {
        select: {
          title: true,
          id: true,
          content: false,
        },
      });

      expect(res).toEqual({
        select: {
          __h: true,
          __v: true,
          title: true,
          id: true,
        },
      });
    });
  });
});
