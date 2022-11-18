import {
  Category,
  PublishedPost,
} from '@/definitions/__test__/category-post-example.js';
import { DummyStore } from '@/store/__test__/dummy-store.js';
import { NeuledgeEngine } from './engine.js';
import { jest } from '@jest/globals';

/* eslint-disable max-lines-per-function */

describe('engine/engine', () => {
  describe('NeuledgeEngine()', () => {
    it('should create new', async () => {
      const engine = new NeuledgeEngine({} as never);

      expect(engine);
    });
  });

  describe('NeuledgeEngine#findMany()', () => {
    let engine: NeuledgeEngine;

    beforeEach(async () => {
      engine = await new NeuledgeEngine({
        store: new DummyStore(),
      }).ready();
    });

    it('should find empty query', async () => {
      jest.spyOn(engine.store, 'find');

      const result = await engine.findMany(Category);

      expect(engine.store.find).toHaveBeenCalledTimes(1);
      expect(engine.store.find).toBeCalledWith({
        collectionName: 'categories',
        limit: 100,
      });

      expect(result).toEqual([]);
    });

    it('should find empty query with a limit', async () => {
      jest.spyOn(engine.store, 'find');

      const result = await engine.findMany(Category).limit(10);

      expect(engine.store.find).toHaveBeenCalledTimes(1);
      expect(engine.store.find).toBeCalledWith({
        collectionName: 'categories',
        limit: 10,
      });

      expect(result).toEqual([]);
    });

    it('should find empty query with a offset', async () => {
      jest.spyOn(engine.store, 'find');

      const result = await engine.findMany(Category).limit(10).offset('foo');

      expect(engine.store.find).toHaveBeenCalledTimes(1);
      expect(engine.store.find).toBeCalledWith({
        collectionName: 'categories',
        limit: 10,
        offset: 'foo',
      });

      expect(result).toEqual([]);
    });

    it('should find empty query with where', async () => {
      jest.spyOn(engine.store, 'find');

      const result = await engine
        .findMany(Category)
        .where({ id: { $gt: 3 } })
        .limit(10);

      expect(engine.store.find).toHaveBeenCalledTimes(1);
      expect(engine.store.find).toBeCalledWith({
        collectionName: 'categories',
        where: { id: { $gt: 3 } },
        limit: 10,
      });

      expect(result).toEqual([]);
    });

    it('should find empty query with select', async () => {
      jest.spyOn(engine.store, 'find');

      const result = await engine
        .findMany(Category)
        .select({ id: true, name: true })
        .limit(10);

      expect(engine.store.find).toHaveBeenCalledTimes(1);
      expect(engine.store.find).toBeCalledWith({
        collectionName: 'categories',
        select: { id: true, name: true },
        limit: 10,
      });

      expect(result).toEqual([]);
    });

    it('should find empty query with string sort', async () => {
      jest.spyOn(engine.store, 'find');

      const result = await engine
        .findMany(PublishedPost)
        .sort('-category.posts')
        .limit(10);

      expect(engine.store.find).toHaveBeenCalledTimes(1);
      expect(engine.store.find).toBeCalledWith({
        collectionName: 'posts',
        sort: { category: 'desc', title: 'desc' },
        limit: 10,
      });

      expect(result).toEqual([]);
    });

    it('should find empty query with custom sort', async () => {
      jest.spyOn(engine.store, 'find');

      const result = await engine
        .findMany(PublishedPost)
        .sort('*', '-content', '+id')
        .limit(10);

      expect(engine.store.find).toHaveBeenCalledTimes(1);
      expect(engine.store.find).toBeCalledWith({
        collectionName: 'posts',
        sort: { content: 'desc', id: 'asc' },
        limit: 10,
      });

      expect(result).toEqual([]);
    });
  });
});
