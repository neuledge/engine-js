import { StoreJoinChoice, StoreLeftJoinChoice } from '@neuledge/store';
import { applyJoinOptions } from './join';

/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

describe('join', () => {
  describe('applyJoins()', () => {
    it('should return same documents if no joins provided', async () => {
      const queryJoin = jest.fn(async () => []);

      await expect(
        applyJoinOptions({}, [{ id: 1 }], queryJoin),
      ).resolves.toEqual([{ id: 1 }]);

      expect(queryJoin).not.toHaveBeenCalled();
    });

    it('should ignore join if no documents provided', async () => {
      const queryJoin = jest.fn(async () => []);

      await expect(
        applyJoinOptions(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: { id: { field: 'category_id' } },
                },
              ],
            },
          },
          [],
          queryJoin,
        ),
      ).resolves.toEqual([]);

      expect(queryJoin).not.toHaveBeenCalled();
    });

    it('should join by post.category_id', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }, { id: 2 }]);

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_id: 1 },
            { id: 103, category_id: 2 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        { id: 101, category_id: 1, category: { id: 1 } },
        { id: 102, category_id: 1, category: { id: 1 } },
        { id: 103, category_id: 2, category: { id: 2 } },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice: choice,
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id and project', async () => {
      const queryJoin = jest.fn(async () => [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ]);

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: { id: { field: 'category_id' } },
        select: { name: true },
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_id: 1 },
            { id: 103, category_id: 2 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        { id: 101, category_id: 1, category: { id: 1, name: 'Category 1' } },
        { id: 102, category_id: 1, category: { id: 1, name: 'Category 1' } },
        { id: 103, category_id: 2, category: { id: 2, name: 'Category 2' } },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice,
          project: { id: 1, name: 1 },
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id and filter missing joins', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_id: 1 },
            { id: 103, category_id: 2 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        { id: 101, category_id: 1, category: { id: 1 } },
        { id: 102, category_id: 1, category: { id: 1 } },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice,
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id and keep missing joins', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      const choice: StoreLeftJoinChoice = {
        collection: { name: 'category' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { leftJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_id: 1 },
            { id: 103, category_id: 2 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        { id: 101, category_id: 1, category: { id: 1 } },
        { id: 102, category_id: 1, category: { id: 1 } },
        { id: 103, category_id: 2 },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice,
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join without select by post.category_id and filter missing joins', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: { id: { field: 'category_id' } },
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_id: 1 },
            { id: 103, category_id: 2 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        { id: 101, category_id: 1 },
        { id: 102, category_id: 1 },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice,
          project: { id: 1 },
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id with same category', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_id: 1 },
            { id: 103, category_id: 1 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        { id: 101, category_id: 1, category: { id: 1 } },
        { id: 102, category_id: 1, category: { id: 1 } },
        { id: 103, category_id: 1, category: { id: 1 } },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice,
          project: null,
          find: { id: { $eq: 1 } },
          limit: 1,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id and single post.category_sub_id', async () => {
      const queryJoin = jest.fn(async () => [
        { id: 1, sub_id: 1 },
        { id: 2, sub_id: 1 },
      ]);

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: {
          id: { field: 'category_id' },
          sub_id: { field: 'category_sub_id' },
        },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1, category_sub_id: 1 },
            { id: 102, category_id: 1, category_sub_id: 1 },
            { id: 103, category_id: 2, category_sub_id: 1 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        {
          id: 101,
          category_id: 1,
          category_sub_id: 1,
          category: { id: 1, sub_id: 1 },
        },
        {
          id: 102,
          category_id: 1,
          category_sub_id: 1,
          category: { id: 1, sub_id: 1 },
        },
        {
          id: 103,
          category_id: 2,
          category_sub_id: 1,
          category: { id: 2, sub_id: 1 },
        },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice,
          project: null,
          find: {
            id: { $in: [1, 2] },
            sub_id: { $eq: 1 },
          },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id and multiple post.category_sub_id', async () => {
      const queryJoin = jest.fn(async () => [
        { id: 1, sub_id: 1 },
        { id: 1, sub_id: 2 },
        { id: 2, sub_id: 1 },
      ]);

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: {
          id: { field: 'category_id' },
          sub_id: { field: 'category_sub_id' },
        },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1, category_sub_id: 1 },
            { id: 102, category_id: 1, category_sub_id: 2 },
            { id: 103, category_id: 2, category_sub_id: 1 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        {
          id: 101,
          category_id: 1,
          category_sub_id: 1,
          category: { id: 1, sub_id: 1 },
        },
        {
          id: 102,
          category_id: 1,
          category_sub_id: 2,
          category: { id: 1, sub_id: 2 },
        },
        {
          id: 103,
          category_id: 2,
          category_sub_id: 1,
          category: { id: 2, sub_id: 1 },
        },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(1);
      expect(queryJoin).toHaveBeenCalledWith(
        {
          collection: { name: 'category' },
          choice,
          project: null,
          find: {
            $or: [
              { id: { $eq: 1 }, sub_id: { $eq: 1 } },
              { id: { $eq: 1 }, sub_id: { $eq: 2 } },
              { id: { $eq: 2 }, sub_id: { $eq: 1 } },
            ],
          },
          limit: 3,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join recursively by post.category_id and category.menu_id', async () => {
      const queryJoin = jest.fn(async (query) => {
        if (query.collection.name === 'category') {
          return [
            { id: 1, menu_id: 1 },
            { id: 2, menu_id: 2 },
          ];
        }

        if (query.collection.name === 'menu') {
          return [
            { id: 1, name: 'menu1' },
            { id: 2, name: 'menu2' },
          ];
        }

        throw new Error('Unexpected query');
      });

      const menuChoice: StoreJoinChoice = {
        collection: { name: 'menu' } as never,
        by: { id: { field: 'menu_id' } },
        select: true,
      };

      const choice: StoreJoinChoice = {
        collection: { name: 'category' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
        innerJoin: { menu: [menuChoice] },
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [choice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_id: 1 },
            { id: 103, category_id: 2 },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        {
          id: 101,
          category_id: 1,
          category: { id: 1, menu_id: 1, menu: { id: 1, name: 'menu1' } },
        },
        {
          id: 102,
          category_id: 1,
          category: { id: 1, menu_id: 1, menu: { id: 1, name: 'menu1' } },
        },
        {
          id: 103,
          category_id: 2,
          category: { id: 2, menu_id: 2, menu: { id: 2, name: 'menu2' } },
        },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(2);
      expect(queryJoin).toHaveBeenNthCalledWith(
        1,
        {
          collection: { name: 'category' },
          choice,
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
      expect(queryJoin).toHaveBeenNthCalledWith(
        2,
        {
          collection: { name: 'menu' },
          choice: menuChoice,
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id or post.category_slug', async () => {
      const queryJoin = jest.fn(async (query, signal) => {
        if (signal.aborted) {
          throw new Error('Aborted');
        }

        if (query.collection.name === 'old_categories') {
          // Simulate a slow query
          await new Promise((resolve) => setTimeout(resolve, 20));

          return [{ id: 1 }, { id: 2 }];
        }

        if (query.collection.name === 'categories') {
          return [{ slug: 'cat1' }, { slug: 'cat2' }];
        }

        throw new Error('Unexpected query');
      });

      const idChoice: StoreJoinChoice = {
        collection: { name: 'old_categories' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
      };

      const slugChoice: StoreJoinChoice = {
        collection: { name: 'categories' } as never,
        by: { slug: { field: 'category_slug' } },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [idChoice, slugChoice] } },
          [
            { id: 101, category_id: 1 },
            { id: 102, category_slug: 'cat2' },
            { id: 103, category_id: 2 },
            { id: 104, category_slug: 'cat1' },
            { id: 105, category_id: 5, category_slug: 'cat2' },
            { id: 106, category_id: 1, category_slug: 'cat10' },
            { id: 107, category_id: 10, category_slug: 'cat1' },
            { id: 108, category_id: 2, category_slug: 'cat15' },
            { id: 109, category_id: 15 },
            { id: 110, category_slug: 'cat20' },
            { id: 111, category_id: 20, category_slug: 'cat25' },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        { id: 101, category_id: 1, category: { id: 1 } },
        { id: 102, category_slug: 'cat2', category: { slug: 'cat2' } },
        { id: 103, category_id: 2, category: { id: 2 } },
        { id: 104, category_slug: 'cat1', category: { slug: 'cat1' } },
        {
          id: 105,
          category_id: 5,
          category_slug: 'cat2',
          category: { slug: 'cat2' },
        },
        {
          id: 106,
          category_id: 1,
          category_slug: 'cat10',
          category: { id: 1 },
        },
        {
          id: 107,
          category_id: 10,
          category_slug: 'cat1',
          category: { slug: 'cat1' },
        },
        {
          id: 108,
          category_id: 2,
          category_slug: 'cat15',
          category: { id: 2 },
        },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(2);
      expect(queryJoin).toHaveBeenNthCalledWith(
        1,
        {
          collection: { name: 'old_categories' },
          choice: idChoice,
          project: null,
          find: { id: { $in: [1, 2, 5, 10, 15, 20] } },
          limit: 6,
        },
        expect.any(AbortSignal),
      );
      expect(queryJoin).toHaveBeenNthCalledWith(
        2,
        {
          collection: { name: 'categories' },
          choice: slugChoice,
          project: null,
          find: {
            slug: { $in: ['cat2', 'cat1', 'cat10', 'cat15', 'cat20', 'cat25'] },
          },
          limit: 6,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_slug and ignore post.category_id', async () => {
      const queryJoin = jest.fn(async (query, signal) => {
        if (query.collection.name === 'old_categories') {
          // Simulate a slow query
          await new Promise((resolve) => setTimeout(resolve, 20e3).unref());

          if (signal.aborted) {
            throw new Error('Aborted');
          }

          return [];
        }

        if (query.collection.name === 'categories') {
          return [{ slug: 'cat1' }, { slug: 'cat2' }];
        }

        throw new Error('Unexpected query');
      });

      const idChoice: StoreJoinChoice = {
        collection: { name: 'old_categories' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
      };

      const slugChoice: StoreJoinChoice = {
        collection: { name: 'categories' } as never,
        by: { slug: { field: 'category_slug' } },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [idChoice, slugChoice] } },
          [
            { id: 105, category_id: 5, category_slug: 'cat2' },
            { id: 107, category_id: 10, category_slug: 'cat1' },
          ],
          queryJoin,
        ),
      ).resolves.toEqual([
        {
          id: 105,
          category_id: 5,
          category_slug: 'cat2',
          category: { slug: 'cat2' },
        },
        {
          id: 107,
          category_id: 10,
          category_slug: 'cat1',
          category: { slug: 'cat1' },
        },
      ]);

      expect(queryJoin).toHaveBeenCalledTimes(2);
      expect(queryJoin).toHaveBeenNthCalledWith(
        1,
        {
          collection: { name: 'old_categories' },
          choice: idChoice,
          project: null,
          find: { id: { $in: [5, 10] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
      expect(queryJoin).toHaveBeenNthCalledWith(
        2,
        {
          collection: { name: 'categories' },
          choice: slugChoice,
          project: null,
          find: { slug: { $in: ['cat2', 'cat1'] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should catch join async errors', async () => {
      const queryJoin = jest.fn(async (query) => {
        if (query.collection.name === 'categories') {
          // Simulate a slow query
          await new Promise((resolve) => setTimeout(resolve, 20));

          return [{ slug: 'cat1' }, { slug: 'cat2' }];
        }

        throw new Error('Unexpected query');
      });

      const idChoice: StoreJoinChoice = {
        collection: { name: 'old_categories' } as never,
        by: { id: { field: 'category_id' } },
        select: true,
      };

      const slugChoice: StoreJoinChoice = {
        collection: { name: 'categories' } as never,
        by: { slug: { field: 'category_slug' } },
        select: true,
      };

      await expect(
        applyJoinOptions(
          { innerJoin: { category: [idChoice, slugChoice] } },
          [
            { id: 105, category_id: 5, category_slug: 'cat2' },
            { id: 107, category_id: 10, category_slug: 'cat1' },
          ],
          queryJoin,
        ),
      ).rejects.toThrow('Unexpected query');

      expect(queryJoin).toHaveBeenCalledTimes(2);
    });
  });
});
