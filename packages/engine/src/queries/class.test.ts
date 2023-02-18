import {
  Category,
  PublishedPost,
} from '@/definitions/__fixtures__/category-post-example/states.codegen';
import { QueryClass } from './class';

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

describe('queries/class', () => {
  describe('QueryClass', () => {
    describe('.return()', () => {
      it('should set query to returns new by default', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.return()).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          returns: 'new',
          select: true,
          exec,
        });
      });

      it('should set query to returns old', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.return('old')).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          returns: 'old',
          select: true,
          exec,
        });
      });

      it('should set query to returns new', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.return('new')).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          returns: 'new',
          select: true,
          exec,
        });
      });
    });

    describe('.select()', () => {
      it('should set query to select by default', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.select()).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          select: true,
          exec,
        });
      });

      it('should set query to select', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.select(true)).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          select: true,
          exec,
        });
      });

      it('should set query to select projection', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(
          query.select({ id: true, name: true, foo: false }),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          select: { id: true, name: true, foo: false },
          exec,
        });
      });

      it('should allow return and select to be chained', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(
          query.return('old').select({ id: true, name: true, foo: false }),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          returns: 'old',
          select: { id: true, name: true, foo: false },
          exec,
        });
      });
    });

    describe('.expand()', () => {
      it('should set query expand with key only', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(query.expand('category')).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          expand: {
            category: {
              type: 'SelectOne',
              select: true,
            },
          },
          exec,
        });
      });

      it('should set query expand with key and inner query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(
          query.expand('category', (q) => q.where({ id: { $gt: 2 } })),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          expand: {
            category: {
              type: 'SelectOne',
              where: { id: { $gt: 2 } },
            },
          },
          exec,
        });
      });

      it('should set query expand with key and states', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(query.expand('category', [Category])).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          expand: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
            },
          },
          exec,
        });
      });

      it('should set query expand with key, states and inner query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(
          query.expand('category', [Category], (q) =>
            q.where({ id: { $lt: 5 } }),
          ),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          expand: {
            category: {
              type: 'SelectOne',
              states: [Category],
              where: { id: { $lt: 5 } },
            },
          },
          exec,
        });
      });
    });

    describe('.populateOne()', () => {
      it('should set query populate one with key only', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(query.populateOne('category')).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          populateOne: {
            category: {
              type: 'SelectOne',
              select: true,
            },
          },
          exec,
        });
      });

      it('should set query populate one with key and inner query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(
          query.populateOne('category', (q) => q.where({ id: { $gt: 2 } })),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          populateOne: {
            category: {
              type: 'SelectOne',
              select: true,
              where: { id: { $gt: 2 } },
            },
          },
          exec,
        });
      });

      it('should set query populate one with key and states', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(
          query.populateOne('category', [Category]),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          populateOne: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
            },
          },
          exec,
        });
      });

      it('should set query populate one with key, states and inner query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(
          query.populateOne('category', [Category], (q) =>
            q.where({ id: { $lt: 5 } }),
          ),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          populateOne: {
            category: {
              type: 'SelectOne',
              states: [Category],
              select: true,
              where: { id: { $lt: 5 } },
            },
          },
          exec,
        });
      });
    });

    describe('.unique()', () => {
      it('should not allow .then() until unique set', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindUnique',
          states: [Category],
          unique: true,
          exec,
        });

        expect(query.then).toBeNull();
        expect(await query).toBe(query);

        await expect(query.exec()).rejects.toThrow(
          "Can't resolve a unique query without the '.unique()' clause",
        );

        expect(exec).toHaveBeenCalledTimes(0);
      });

      it('should set query unique', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindUnique',
          states: [Category],
          unique: true,
          exec,
        });

        await expect(
          query.unique({ id: { $eq: '1' }, name: { $eq: 'foo' } }),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindUnique',
          states: [Category],
          unique: { id: { $eq: '1' }, name: { $eq: 'foo' } },
          exec,
        });
      });
    });

    describe('.where()', () => {
      it('should set query where', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(
          query.where({ id: { $eq: '1' }, name: { $eq: 'foo' } }),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          where: { id: { $eq: '1' }, name: { $eq: 'foo' } },
          exec,
        });
      });

      it('should clear query where', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          where: { id: { $eq: '1' }, name: { $eq: 'foo' } },
          exec,
        });

        await expect(query.where(null)).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          where: null,
          exec,
        });
      });
    });

    describe('.match()', () => {
      it('should set query match with key only', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'AlterMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'AlterMany',
          states: [PublishedPost],
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });

        await expect(query.match('category')).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'AlterMany',
          states: [PublishedPost],
          match: {
            category: {
              type: 'Filter',
            },
          },
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });
      });

      it('should set query match with key and inner query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'AlterMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'AlterMany',
          states: [PublishedPost],
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });

        await expect(
          query.match('category', (q) => q.where({ id: { $gt: 2 } })),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'AlterMany',
          states: [PublishedPost],
          match: {
            category: {
              type: 'Filter',
              where: { id: { $gt: 2 } },
            },
          },
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });
      });

      it('should set query match with key and inner recursive query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'AlterMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'AlterMany',
          states: [PublishedPost],
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });

        await expect(
          query.match('category', (q) =>
            q.where({ id: { $gt: 2 } }).match('posts', [PublishedPost]),
          ),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'AlterMany',
          states: [PublishedPost],
          match: {
            category: {
              type: 'Filter',
              where: { id: { $gt: 2 } },
              match: {
                posts: {
                  type: 'Filter',
                  states: [PublishedPost],
                },
              },
            },
          },
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });
      });

      it('should set query match with key and states', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'AlterMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'AlterMany',
          states: [PublishedPost],
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });

        await expect(query.match('category', [Category])).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'AlterMany',
          states: [PublishedPost],
          match: {
            category: {
              type: 'Filter',
              states: [Category],
            },
          },
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });
      });

      it('should set query match with key, states and inner query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'AlterMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'AlterMany',
          states: [PublishedPost],
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });

        await expect(
          query.match('category', [Category], (q) =>
            q.where({ id: { $lt: 5 } }),
          ),
        ).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'AlterMany',
          states: [PublishedPost],
          match: {
            category: {
              type: 'Filter',
              states: [Category],
              where: { id: { $lt: 5 } },
            },
          },
          method: 'update',
          args: [{ title: 'foo', content: 'bar', category: { id: 123 } }],
          returns: 'new',
          exec,
        });
      });
    });

    describe('.sort()', () => {
      it('should set query sort by index', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass<
          'FindMany',
          typeof PublishedPost,
          typeof PublishedPost
        >({
          type: 'FindMany',
          states: [PublishedPost],
          exec,
        });

        await expect(query.sort('-category_title')).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [PublishedPost],
          sort: '-category_title',
          exec,
        });
      });

      it('should set query sort by fields', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.sort('*', '+name')).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          sort: ['+name'],
          exec,
        });
      });
    });

    describe('.limit()', () => {
      it('should set query limit', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.limit(10)).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          limit: 10,
          exec,
        });
      });

      it('should disable query limit', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          limit: 10,
          exec,
        });

        await expect(query.limit(null)).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          limit: null,
          exec,
        });
      });
    });

    describe('.offset()', () => {
      it('should set query offset', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.offset(10)).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          offset: 10,
          exec,
        });
      });

      it('should disable query offset', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          offset: 10,
          exec,
        });

        await expect(query.offset(null)).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          offset: null,
          exec,
        });
      });
    });

    describe('.exec()', () => {
      it('should exec basic query', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query.exec()).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          exec,
        });
      });
    });

    describe('.then()', () => {
      it('should exec basic query without calling .exec()', async () => {
        const exec = jest.fn().mockResolvedValue([]);

        const query = new QueryClass({
          type: 'FindMany',
          states: [Category],
          exec,
        });

        await expect(query).resolves.toEqual([]);

        expect(exec).toHaveBeenCalledTimes(1);

        expect(exec).toHaveBeenCalledWith({
          type: 'FindMany',
          states: [Category],
          exec,
        });
      });
    });
  });
});
