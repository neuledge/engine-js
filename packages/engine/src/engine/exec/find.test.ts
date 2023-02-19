import { Store } from '@neuledge/store';
import {
  Category,
  DraftPost,
  PublishedPost,
} from '@/definitions/__fixtures__/category-post-example';
import { Metadata } from '@/metadata';
import { NeuledgeEngine } from '../engine';
import { DummyStore } from '../__fixtures__/dummy-store';
import {
  execFindFirst,
  execFindFirstOrThrow,
  execFindMany,
  execFindUnique,
  execFindUniqueOrThrow,
} from './find';

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

describe('/engine/exec/find', () => {
  let engine: NeuledgeEngine;
  let store: Store;
  let metadata: Metadata;

  beforeEach(async () => {
    store = new DummyStore();
    engine = await new NeuledgeEngine({ store }).ready();
    metadata = await engine.metadata;
  });

  describe('execFindMany()', () => {
    it('should allow empty result', async () => {
      const spy = jest.spyOn(store, 'find').mockImplementation(async () => []);

      await expect(
        execFindMany(engine, {
          type: 'FindMany',
          states: [Category],
          exec: null as never,
        }),
      ).resolves.toEqual([]);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
        },
        limit: 1000,
      });
    });

    it('should find all by states', async () => {
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        { id: 1, __h: categoryHash, __v: 1, name: 'Category 1' },
        { id: 2, __h: categoryHash, __v: 2, name: 'Category 2' },
      ]);

      await expect(
        execFindMany(engine, {
          type: 'FindMany',
          states: [Category],
          exec: null as never,
        }),
      ).resolves.toEqual([
        { $state: 'Category', $version: 1, id: 1, name: 'Category 1' },
        { $state: 'Category', $version: 2, id: 2, name: 'Category 2' },
      ]);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [categoryHash] },
        },
        limit: 1000,
      });
    });

    it('should find states by where and select', async () => {
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest
        .spyOn(store, 'find')
        .mockImplementation(async () => [{ id: 1, __h: categoryHash, __v: 1 }]);

      await expect(
        execFindMany(engine, {
          type: 'FindMany',
          states: [Category],
          where: { id: { $eq: 1 } },
          select: { id: true },
          exec: null as never,
        }),
      ).resolves.toEqual([{ $state: 'Category', $version: 1, id: 1 }]);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        select: { id: true, __h: true, __v: true },
        where: {
          __h: { $in: [categoryHash] },
          id: { $eq: 1 },
        },
        limit: 1000,
      });
    });

    it('should find states by sort, offset and limit', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () =>
        Object.assign(
          [
            {
              __h: hash,
              __v: 2,
              id: 2,
              title: 'Post 2',
              category_id: 2,
              content: '',
              published_at: new Date('2020-01-02'),
            },
            {
              __h: hash,
              __v: 1,
              id: 1,
              title: 'Post 1',
              category_id: 1,
              content: '',
              published_at: new Date('2020-01-01'),
            },
          ],
          { nextOffset: 7 },
        ),
      );

      await expect(
        execFindMany(engine, {
          type: 'FindMany',
          states: [PublishedPost],
          sort: '-category_title',
          limit: 2,
          offset: 5,
          exec: null as never,
        }),
      ).resolves.toEqual(
        Object.assign(
          [
            {
              $state: 'PublishedPost',
              $version: 2,
              id: 2,
              title: 'Post 2',
              category: { id: 2 },
              content: '',
              publishedAt: new Date('2020-01-02'),
            },
            {
              $state: 'PublishedPost',
              $version: 1,
              id: 1,
              title: 'Post 1',
              category: { id: 1 },
              content: '',
              publishedAt: new Date('2020-01-01'),
            },
          ],
          { nextOffset: 7 },
        ),
      );

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        where: {
          __h: { $in: [hash] },
        },
        sort: { category_id: 'asc', title: 'desc' },
        limit: 2,
        offset: 5,
      });
    });

    it('should find states and expand', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
          category: { __h: categoryHash, __v: 1, id: 1, name: 'Category 1' },
        },
        {
          __h: hash,
          __v: 2,
          id: 2,
          title: 'Post 2',
          category: { __h: categoryHash, __v: 1, id: 2, name: 'Category 2' },
        },
      ]);

      await expect(
        execFindMany(engine, {
          type: 'FindMany',
          states: [PublishedPost],
          select: { id: true, title: true },
          expand: {
            category: {
              type: 'SelectOne',
              select: true,
              states: [Category],
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual([
        {
          $state: 'PublishedPost',
          $version: 1,
          id: 1,
          title: 'Post 1',
          category: {
            $state: 'Category',
            $version: 1,
            id: 1,
            name: 'Category 1',
          },
        },
        {
          $state: 'PublishedPost',
          $version: 2,
          id: 2,
          title: 'Post 2',
          category: {
            $state: 'Category',
            $version: 1,
            id: 2,
            name: 'Category 2',
          },
        },
      ]);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        select: { id: true, title: true, __h: true, __v: true },
        innerJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: {
          __h: { $in: [hash] },
        },
        limit: 1000,
      });
    });

    it('should find states and populate one', async () => {
      const hash = metadata.findStateByKey(DraftPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
          category: { __h: categoryHash, __v: 1, id: 1, name: 'Category 1' },
        },
        {
          __h: hash,
          __v: 2,
          id: 2,
          title: 'Post 2',
        },
      ]);

      await expect(
        execFindMany(engine, {
          type: 'FindMany',
          states: [DraftPost],
          select: { id: true, title: true },
          populateOne: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual([
        {
          $state: 'DraftPost',
          $version: 1,
          id: 1,
          title: 'Post 1',
          category: {
            $state: 'Category',
            $version: 1,
            id: 1,
            name: 'Category 1',
          },
        },
        {
          $state: 'DraftPost',
          $version: 2,
          id: 2,
          title: 'Post 2',
        },
      ]);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        select: { id: true, title: true, __h: true, __v: true },
        leftJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: {
          __h: { $in: [hash] },
        },
        limit: 1000,
      });
    });
  });

  describe('execFindUnique()', () => {
    it('should allow empty result', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => []);

      await expect(
        execFindUnique(engine, {
          type: 'FindUnique',
          states: [PublishedPost],
          unique: { id: 1 },
          exec: null as never,
        }),
      ).resolves.toBeNull();

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should find state and select', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
        },
      ]);

      await expect(
        execFindUnique(engine, {
          type: 'FindUnique',
          states: [PublishedPost],
          unique: { id: 1 },
          select: { id: true, title: true },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        select: { id: true, title: true, __h: true, __v: true },
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should find state and expand', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
          category: {
            __h: categoryHash,
            __v: 1,
            id: 1,
            name: 'Category 1',
          },
          content: '',
          published_at: new Date('2020-01-01'),
        },
      ]);

      await expect(
        execFindUnique(engine, {
          type: 'FindUnique',
          states: [PublishedPost],
          unique: { id: 1 },
          expand: {
            category: {
              type: 'SelectOne',
              select: true,
              states: [Category],
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
        category: {
          $state: 'Category',
          $version: 1,
          id: 1,
          name: 'Category 1',
        },
        content: '',
        publishedAt: new Date('2020-01-01'),
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        innerJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should find state and populate one', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
        },
      ]);

      await expect(
        execFindUnique(engine, {
          type: 'FindUnique',
          states: [PublishedPost],
          select: { id: true, title: true },
          unique: { id: 1 },
          populateOne: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        select: { id: true, title: true, __h: true, __v: true },
        leftJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });
  });

  describe('execFindUniqueOrThrow()', () => {
    it('should throw if empty result', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => []);

      await expect(
        execFindUniqueOrThrow(engine, {
          type: 'FindUniqueOrThrow',
          states: [PublishedPost],
          unique: { id: 1 },
          exec: null as never,
        }),
      ).rejects.toThrow('Document not found');

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should return result with select', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
        },
      ]);

      await expect(
        execFindUniqueOrThrow(engine, {
          type: 'FindUniqueOrThrow',
          states: [PublishedPost],
          unique: { id: 1 },
          select: { id: true, title: true },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        select: { id: true, title: true, __h: true, __v: true },
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should return result with expand', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
          category: {
            __h: categoryHash,
            __v: 1,
            id: 1,
            name: 'Category 1',
          },
          content: '',
          published_at: new Date('2020-01-01'),
        },
      ]);

      await expect(
        execFindUniqueOrThrow(engine, {
          type: 'FindUniqueOrThrow',
          states: [PublishedPost],
          unique: { id: 1 },
          expand: {
            category: {
              type: 'SelectOne',
              select: true,
              states: [Category],
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
        category: {
          $state: 'Category',
          $version: 1,
          id: 1,
          name: 'Category 1',
        },
        content: '',
        publishedAt: new Date('2020-01-01'),
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        innerJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should return result with populate one', async () => {
      const hash = metadata.findStateByKey(DraftPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
        },
      ]);

      await expect(
        execFindUniqueOrThrow(engine, {
          type: 'FindUniqueOrThrow',
          states: [DraftPost],
          unique: { id: 1 },
          populateOne: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'DraftPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        leftJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: {
          __h: { $in: [hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });
    });
  });

  describe('execFindFirst()', () => {
    it('should return null if empty result', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => []);

      await expect(
        execFindFirst(engine, {
          type: 'FindFirst',
          states: [PublishedPost],
          where: { category: { $eq: { id: 1 } } },
          exec: null as never,
        }),
      ).resolves.toBeNull();

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        where: {
          __h: { $in: [hash] },
          category_id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should return result with select, sort and offest', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest
        .spyOn(store, 'find')
        .mockImplementation(async () => [
          { __h: hash, __v: 1, id: 1, title: 'Post 1' },
        ]);

      await expect(
        execFindFirst(engine, {
          type: 'FindFirst',
          states: [PublishedPost],
          select: { id: true, title: true },
          sort: '+category_title',
          offset: 10,
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        select: { id: true, title: true, __h: true, __v: true },
        where: { __h: { $in: [hash] } },
        sort: { category_id: 'desc', title: 'asc' },
        offset: 10,
        limit: 1,
      });
    });

    it('should return result with expand', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
          category: {
            __h: categoryHash,
            __v: 1,
            id: 1,
            name: 'Category 1',
          },
          content: '',
          published_at: new Date('2020-01-01'),
        },
      ]);

      await expect(
        execFindFirst(engine, {
          type: 'FindFirst',
          states: [PublishedPost],
          expand: {
            category: {
              type: 'SelectOne',
              select: true,
              states: [Category],
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
        category: {
          $state: 'Category',
          $version: 1,
          id: 1,
          name: 'Category 1',
        },
        content: '',
        publishedAt: new Date('2020-01-01'),
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        innerJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: { __h: { $in: [hash] } },
        limit: 1,
      });
    });

    it('should return result with populate one', async () => {
      const hash = metadata.findStateByKey(DraftPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
        },
      ]);

      await expect(
        execFindFirst(engine, {
          type: 'FindFirst',
          states: [DraftPost],
          populateOne: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'DraftPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        leftJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: { __h: { $in: [hash] } },
        limit: 1,
      });
    });
  });

  describe('execFindFirstOrThrow()', () => {
    it('should throw if empty result', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => []);

      await expect(
        execFindFirstOrThrow(engine, {
          type: 'FindFirstOrThrow',
          states: [PublishedPost],
          where: { category: { $eq: { id: 1 } } },
          exec: null as never,
        }),
      ).rejects.toThrow('Document not found');

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        where: {
          __h: { $in: [hash] },
          category_id: { $eq: 1 },
        },
        limit: 1,
      });
    });

    it('should return result with select, sort and offest', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;

      const spy = jest
        .spyOn(store, 'find')
        .mockImplementation(async () => [
          { __h: hash, __v: 1, id: 1, title: 'Post 1' },
        ]);

      await expect(
        execFindFirstOrThrow(engine, {
          type: 'FindFirstOrThrow',
          states: [PublishedPost],
          select: { id: true, title: true },
          sort: '+category_title',
          offset: 10,
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        select: { id: true, title: true, __h: true, __v: true },
        where: { __h: { $in: [hash] } },
        sort: { category_id: 'desc', title: 'asc' },
        offset: 10,
        limit: 1,
      });
    });

    it('should return result with expand', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
          category: {
            __h: categoryHash,
            __v: 1,
            id: 1,
            name: 'Category 1',
          },
          content: '',
          published_at: new Date('2020-01-01'),
        },
      ]);

      await expect(
        execFindFirstOrThrow(engine, {
          type: 'FindFirstOrThrow',
          states: [PublishedPost],
          expand: {
            category: {
              type: 'SelectOne',
              select: true,
              states: [Category],
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'PublishedPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
        category: {
          $state: 'Category',
          $version: 1,
          id: 1,
          name: 'Category 1',
        },
        content: '',
        publishedAt: new Date('2020-01-01'),
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        innerJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: { __h: { $in: [hash] } },
        limit: 1,
      });
    });

    it('should return result with populate one', async () => {
      const hash = metadata.findStateByKey(DraftPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          __h: hash,
          __v: 1,
          id: 1,
          title: 'Post 1',
        },
      ]);

      await expect(
        execFindFirstOrThrow(engine, {
          type: 'FindFirstOrThrow',
          states: [DraftPost],
          populateOne: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
            },
          },
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'DraftPost',
        $version: 1,
        id: 1,
        title: 'Post 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        leftJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              select: true,
              where: { __h: { $in: [categoryHash] } },
            },
          ],
        },
        where: { __h: { $in: [hash] } },
        limit: 1,
      });
    });
  });
});
