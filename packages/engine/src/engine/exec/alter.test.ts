import { Store } from '@neuledge/store';
import { Metadata } from '@/metadata';
import { NeuledgeEngine } from '../engine';
import { DummyStore } from '../__fixtures__/dummy-store';
import { execAlterMany, execAlterOne } from './alter';
import {
  Category,
  PublishedPost,
} from '@/definitions/__fixtures__/category-post-example';

/* eslint-disable max-lines-per-function */

describe('engine/exec/alter', () => {
  let engine: NeuledgeEngine;
  let store: Store;
  let metadata: Metadata;

  beforeEach(async () => {
    store = new DummyStore();
    engine = await new NeuledgeEngine({ store }).ready();
    metadata = await engine.metadata;
  });

  describe('execAlterMany()', () => {
    it('should alter many without results and where', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const find = jest.spyOn(store, 'find').mockImplementation(async () => [
        { id: 1, name: 'test 1', __h: hash, __v: 0 },
        { id: 2, name: 'test 2', __h: hash, __v: 0 },
      ]);

      const update = jest
        .spyOn(store, 'update')
        .mockImplementation(async () => ({
          affectedCount: 1,
        }));

      await expect(
        execAlterMany(engine, {
          type: 'AlterMany',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          where: { id: { $in: [1, 2] } },
          returns: 'new',
          exec: null as never,
        }),
      ).resolves.toBeUndefined();

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
          id: { $in: [1, 2] },
        },
        limit: 1000,
      });

      expect(update).toHaveBeenCalledTimes(2);
      expect(update).toHaveBeenNthCalledWith(1, {
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 1 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
      expect(update).toHaveBeenNthCalledWith(2, {
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 2 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
    });

    it('should alter many with results and limit', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const find = jest.spyOn(store, 'find').mockImplementation(async () => [
        { id: 1, name: 'test 1', __h: hash, __v: 0 },
        { id: 2, name: 'test 2', __h: hash, __v: 0 },
      ]);

      const update = jest
        .spyOn(store, 'update')
        .mockImplementation(async () => ({
          affectedCount: 1,
        }));

      await expect(
        execAlterMany(engine, {
          type: 'AlterMany',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          select: true,
          returns: 'new',
          limit: 5,
          exec: null as never,
        }),
      ).resolves.toEqual([
        {
          $state: 'Category',
          $version: 1,
          id: 1,
          name: 'foo',
          description: 'bar',
        },
        {
          $state: 'Category',
          $version: 1,
          id: 2,
          name: 'foo',
          description: 'bar',
        },
      ]);

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
        },
        limit: 5,
      });

      expect(update).toHaveBeenCalledTimes(2);
      expect(update).toHaveBeenNthCalledWith(1, {
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 1 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
      expect(update).toHaveBeenNthCalledWith(2, {
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 2 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
    });

    it('should alter many and select old results', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const find = jest.spyOn(store, 'find').mockImplementation(async () => [
        { id: 1, name: 'test 1', __h: hash, __v: 0 },
        { id: 2, name: 'test 2', __h: hash, __v: 0 },
      ]);

      const update = jest
        .spyOn(store, 'update')
        .mockImplementation(async () => ({
          affectedCount: 1,
        }));

      await expect(
        execAlterMany(engine, {
          type: 'AlterMany',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          select: { id: true, name: true },
          returns: 'old',
          exec: null as never,
        }),
      ).resolves.toEqual([
        { $state: 'Category', $version: 0, id: 1, name: 'test 1' },
        { $state: 'Category', $version: 0, id: 2, name: 'test 2' },
      ]);

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
        },
        limit: 1000,
      });

      expect(update).toHaveBeenCalledTimes(2);
      expect(update).toHaveBeenNthCalledWith(1, {
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 1 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
      expect(update).toHaveBeenNthCalledWith(2, {
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 2 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
    });

    it('should alter many with match', async () => {
      const hash = metadata.findStateByKey(PublishedPost.$name)?.hash;
      const categoryHash = metadata.findStateByKey(Category.$name)?.hash;

      const find = jest.spyOn(store, 'find').mockImplementation(async () => [
        {
          id: 1,
          title: 'title 1',
          content: 'content 1',
          category_id: 2,
          __h: hash,
          __v: 0,
        },
        {
          id: 2,
          title: 'title 2',
          content: 'content 2',
          category_id: 2,
          __h: hash,
          __v: 0,
        },
      ]);

      const update = jest
        .spyOn(store, 'update')
        .mockImplementation(async () => ({
          affectedCount: 1,
        }));

      await expect(
        execAlterMany(engine, {
          type: 'AlterMany',
          states: [PublishedPost],
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 1 } }],
          match: {
            category: {
              type: 'Refine',
              filter: { id: { $eq: 2 } },
            },
          },
          returns: 'new',
          exec: null as never,
        }),
      ).resolves.toBeUndefined();

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['posts'],
        where: {
          __h: { $in: [hash] },
        },
        innerJoin: {
          category: [
            {
              collection: metadata['collections']['categories'],
              by: { id: { field: 'category_id' } },
              where: {
                __h: { $in: [categoryHash] },
                id: { $eq: 2 },
              },
            },
          ],
        },
        limit: 1000,
      });

      expect(update).toHaveBeenCalledTimes(2);
      expect(update).toHaveBeenNthCalledWith(1, {
        collection: metadata['collections']['posts'],
        where: { id: { $eq: 1 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { title: 'foo', content: 'bar', category_id: 1, __v: 1 },
        limit: 1,
      });
      expect(update).toHaveBeenNthCalledWith(2, {
        collection: metadata['collections']['posts'],
        where: { id: { $eq: 2 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { title: 'foo', content: 'bar', category_id: 1, __v: 1 },
        limit: 1,
      });
    });
  });

  describe('execAlterOne()', () => {
    it('should alter first with no results', async () => {
      const find = jest.spyOn(store, 'find').mockImplementation(async () => []);
      const update = jest.spyOn(store, 'update');

      await expect(
        execAlterOne(engine, {
          type: 'AlterFirst',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          returns: 'new',
          exec: null as never,
        }),
      ).resolves.toBeUndefined();

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
        },
        limit: 1,
      });

      expect(update).not.toHaveBeenCalled();
    });

    it('should alter first with empty results', async () => {
      const find = jest.spyOn(store, 'find').mockImplementation(async () => []);
      const update = jest.spyOn(store, 'update');

      await expect(
        execAlterOne(engine, {
          type: 'AlterFirst',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          returns: 'new',
          select: true,
          exec: null as never,
        }),
      ).resolves.toBeUndefined();

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
        },
        limit: 1,
      });

      expect(update).not.toHaveBeenCalled();
    });

    it('should alter first with results', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const find = jest
        .spyOn(store, 'find')
        .mockImplementation(async () => [
          { id: 1, name: 'test 1', __h: hash, __v: 0 },
        ]);

      const update = jest
        .spyOn(store, 'update')
        .mockImplementation(async () => ({ affectedCount: 1 }));

      await expect(
        execAlterOne(engine, {
          type: 'AlterFirst',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          returns: 'new',
          select: true,
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'Category',
        $version: 1,
        id: 1,
        name: 'foo',
        description: 'bar',
      });

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
        },
        limit: 1,
      });

      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 1 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
    });

    it('should alter first and throw with emptry results', async () => {
      const find = jest.spyOn(store, 'find').mockImplementation(async () => []);
      const update = jest.spyOn(store, 'update');

      await expect(
        execAlterOne(engine, {
          type: 'AlterFirstOrThrow',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          returns: 'new',
          exec: null as never,
        }),
      ).rejects.toThrow('Document not found');

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
        },
        limit: 1,
      });

      expect(update).not.toHaveBeenCalled();
    });

    it('should alter unique with results', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const find = jest
        .spyOn(store, 'find')
        .mockImplementation(async () => [
          { id: 1, name: 'test 1', __h: hash, __v: 0 },
        ]);

      const update = jest
        .spyOn(store, 'update')
        .mockImplementation(async () => ({ affectedCount: 1 }));

      await expect(
        execAlterOne(engine, {
          type: 'AlterUnique',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          unique: { id: 1 },
          returns: 'new',
          select: true,
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'Category',
        $version: 1,
        id: 1,
        name: 'foo',
        description: 'bar',
      });

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });

      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: { id: { $eq: 1 }, __h: { $eq: hash }, __v: { $eq: 0 } },
        set: { name: 'foo', description: 'bar', __v: 1 },
        limit: 1,
      });
    });

    it('should alter unique and throw with emptry results', async () => {
      const find = jest.spyOn(store, 'find').mockImplementation(async () => []);
      const update = jest.spyOn(store, 'update');

      await expect(
        execAlterOne(engine, {
          type: 'AlterUniqueOrThrow',
          states: [Category],
          method: 'update',
          args: [{ name: 'foo', description: 'bar' }],
          unique: { id: 1 },
          returns: 'new',
          exec: null as never,
        }),
      ).rejects.toThrow('Document not found');

      expect(find).toHaveBeenCalledTimes(1);
      expect(find).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        where: {
          __h: { $in: [metadata.findStateByKey(Category.$name)?.hash] },
          id: { $eq: 1 },
        },
        limit: 1,
      });

      expect(update).not.toHaveBeenCalled();
    });
  });
});
