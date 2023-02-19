import { Store } from '@neuledge/store';
import { Metadata } from '@/metadata';
import { NeuledgeEngine } from '../engine';
import { DummyStore } from '../__fixtures__/dummy-store';
import { execInitMany, execInitOne } from './init';
import { Category } from '@/definitions/__fixtures__/category-post-example';

/* eslint-disable max-lines-per-function */

describe('engine/exec/init', () => {
  let engine: NeuledgeEngine;
  let store: Store;
  let metadata: Metadata;

  beforeEach(async () => {
    store = new DummyStore();
    engine = await new NeuledgeEngine({ store }).ready();
    metadata = await engine.metadata;
  });

  describe('execInitMany()', () => {
    it('should init many without results', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'insert').mockImplementation(async () => ({
        affectedCount: 2,
        insertedIds: [{ id: 1 }, { id: 2 }],
      }));

      await expect(
        execInitMany(engine, {
          type: 'InitMany',
          states: [Category],
          method: 'create',
          args: [{ name: 'test 1' }, { name: 'test 2' }],
          exec: null as never,
        }),
      ).resolves.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        documents: [
          { __h: hash, __v: 0, id: null, name: 'test 1' },
          { __h: hash, __v: 0, id: null, name: 'test 2' },
        ],
      });
    });

    it('should init many with results', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'insert').mockImplementation(async () => ({
        affectedCount: 2,
        insertedIds: [{ id: 1 }, { id: 2 }],
      }));

      await expect(
        execInitMany(engine, {
          type: 'InitMany',
          states: [Category],
          method: 'create',
          select: true,
          args: [{ name: 'test 1' }, { name: 'test 2' }],
          exec: null as never,
        }),
      ).resolves.toEqual([
        { $state: 'Category', $version: 0, id: 1, name: 'test 1' },
        { $state: 'Category', $version: 0, id: 2, name: 'test 2' },
      ]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        documents: [
          { __h: hash, __v: 0, id: null, name: 'test 1' },
          { __h: hash, __v: 0, id: null, name: 'test 2' },
        ],
      });
    });

    it('should init many with results and select', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'insert').mockImplementation(async () => ({
        affectedCount: 2,
        insertedIds: [{ id: 1 }, { id: 2 }],
      }));

      await expect(
        execInitMany(engine, {
          type: 'InitMany',
          states: [Category],
          method: 'create',
          select: { id: true },
          args: [{ name: 'test 1' }, { name: 'test 2' }],
          exec: null as never,
        }),
      ).resolves.toEqual([
        { $state: 'Category', $version: 0, id: 1 },
        { $state: 'Category', $version: 0, id: 2 },
      ]);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        documents: [
          { __h: hash, __v: 0, id: null, name: 'test 1' },
          { __h: hash, __v: 0, id: null, name: 'test 2' },
        ],
      });
    });
  });

  describe('execInitOne()', () => {
    it('should init one without result', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'insert').mockImplementation(async () => ({
        affectedCount: 1,
        insertedIds: [{ id: 1 }],
      }));

      await expect(
        execInitOne(engine, {
          type: 'InitOne',
          states: [Category],
          method: 'create',
          args: [{ name: 'test 1' }],
          exec: null as never,
        }),
      ).resolves.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        documents: [{ __h: hash, __v: 0, id: null, name: 'test 1' }],
      });
    });

    it('should init one with result', async () => {
      const hash = metadata.findStateByKey(Category.$name)?.hash;

      const spy = jest.spyOn(store, 'insert').mockImplementation(async () => ({
        affectedCount: 1,
        insertedIds: [{ id: 1 }],
      }));

      await expect(
        execInitOne(engine, {
          type: 'InitOne',
          states: [Category],
          method: 'create',
          select: true,
          args: [{ name: 'test 1' }],
          exec: null as never,
        }),
      ).resolves.toEqual({
        $state: 'Category',
        $version: 0,
        id: 1,
        name: 'test 1',
      });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        collection: metadata['collections']['categories'],
        documents: [{ __h: hash, __v: 0, id: null, name: 'test 1' }],
      });
    });
  });
});
