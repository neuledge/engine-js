import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { DummyStore } from './__fixtures__/dummy-store';
import { NeuledgeEngine } from './engine';
import { QueryClass } from '@/index';

/* eslint-disable max-lines-per-function */

describe('engine/engine', () => {
  describe('NeuledgeEngine()', () => {
    let engine: NeuledgeEngine;

    beforeEach(() => {
      engine = new NeuledgeEngine({
        store: new DummyStore(),
      });
    });

    describe('.ready()', () => {
      it('should be ready', async () => {
        await expect(engine.ready()).resolves.toBe(engine);
      });
    });

    describe('.findMany()', () => {
      it('should return "FindMany" query class', async () => {
        const query = engine.findMany(...Post);

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'FindMany',
          states: [...Post],
        });
      });
    });

    describe('.findFirst()', () => {
      it('should return "FindFirst" query class', async () => {
        const query = engine.findFirst(Category);

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'FindFirst',
          states: [Category],
        });
      });
    });

    describe('.findFirstOrThrow()', () => {
      it('should return "FindFirstOrThrow" query class', async () => {
        const query = engine.findFirstOrThrow(Category);

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'FindFirstOrThrow',
          states: [Category],
        });
      });
    });

    describe('.findUnique()', () => {
      it('should return "FindUnique" query class', async () => {
        const query = engine.findUnique(Category);

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'FindUnique',
          states: [Category],
        });
      });
    });

    describe('.findUniqueOrThrow()', () => {
      it('should return "FindUniqueOrThrow" query class', async () => {
        const query = engine.findUniqueOrThrow(Category);

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'FindUniqueOrThrow',
          states: [Category],
        });
      });
    });

    describe('.initMany()', () => {
      it('should return "InitMany" query class', async () => {
        const query = engine
          .initMany(Category)
          .create({ name: 'test 1' }, { name: 'test 2' });

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'InitMany',
          states: [Category],
          method: 'create',
          args: [{ name: 'test 1' }, { name: 'test 2' }],
        });
      });
    });

    describe('.initOne()', () => {
      it('should return "InitOne" query class', async () => {
        const query = engine.initOne(Category).create({ name: 'test 1' });

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'InitOne',
          states: [Category],
          method: 'create',
          args: [{ name: 'test 1' }],
        });
      });
    });

    describe('.alterMany()', () => {
      it('should return "AlterMany" query class', async () => {
        const query = engine.alterMany(Category).update({
          name: 'test 1',
        });

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'AlterMany',
          states: [Category],
          method: 'update',
          args: [{ name: 'test 1' }],
        });
      });
    });

    describe('.alterFirst()', () => {
      it('should return "AlterFirst" query class', async () => {
        const query = engine.alterFirst(Category).update({
          name: 'test 1',
        });

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'AlterFirst',
          states: [Category],
          method: 'update',
          args: [{ name: 'test 1' }],
        });
      });
    });

    describe('.alterFirstOrThrow()', () => {
      it('should return "AlterFirstOrThrow" query class', async () => {
        const query = engine.alterFirstOrThrow(Category).update({
          name: 'test 1',
        });

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'AlterFirstOrThrow',
          states: [Category],
          method: 'update',
          args: [{ name: 'test 1' }],
        });
      });
    });

    describe('.alterUnique()', () => {
      it('should return "AlterUnique" query class', async () => {
        const query = engine.alterUnique(Category).update({
          name: 'test 1',
        });

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'AlterUnique',
          states: [Category],
          method: 'update',
          args: [{ name: 'test 1' }],
        });
      });
    });

    describe('.alterUniqueOrThrow()', () => {
      it('should return "AlterUniqueOrThrow" query class', async () => {
        const query = engine.alterUniqueOrThrow(Category).update({
          name: 'test 1',
        });

        expect(query).toBeInstanceOf(QueryClass);

        expect(query['options' as never]).toMatchObject({
          type: 'AlterUniqueOrThrow',
          states: [Category],
          method: 'update',
          args: [{ name: 'test 1' }],
        });
      });
    });
  });
});
