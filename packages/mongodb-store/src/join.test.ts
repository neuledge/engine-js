import { applyJoins } from './join';

/* eslint-disable max-lines-per-function */

describe('join', () => {
  describe('applyJoins()', () => {
    it('should return same documents if no joins provided', async () => {
      const queryJoin = jest.fn(async () => []);

      await expect(applyJoins({}, [{ id: 1 }], queryJoin)).resolves.toEqual([
        { id: 1 },
      ]);

      expect(queryJoin).not.toHaveBeenCalled();
    });

    it('should ignore join if no documents provided', async () => {
      const queryJoin = jest.fn(async () => []);

      await expect(
        applyJoins(
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

      await expect(
        applyJoins(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: { id: { field: 'category_id' } },
                  select: true,
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
            select: true,
          },
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

      await expect(
        applyJoins(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: { id: { field: 'category_id' } },
                  select: { name: true },
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
            select: { name: true },
          },
          project: { id: 1, name: 1 },
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id and filter missing joins', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      await expect(
        applyJoins(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: { id: { field: 'category_id' } },
                  select: true,
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
            select: true,
          },
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id and keep missing joins', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      await expect(
        applyJoins(
          {
            leftJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: { id: { field: 'category_id' } },
                  select: true,
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
            select: true,
          },
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join without select by post.category_id and filter missing joins', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      await expect(
        applyJoins(
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
          options: {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
          },
          project: { id: 1 },
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });

    it('should join by post.category_id with same category', async () => {
      const queryJoin = jest.fn(async () => [{ id: 1 }]);

      await expect(
        applyJoins(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: { id: { field: 'category_id' } },
                  select: true,
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
            select: true,
          },
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

      await expect(
        applyJoins(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: {
                    id: { field: 'category_id' },
                    sub_id: { field: 'category_sub_id' },
                  },
                  select: true,
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: {
              id: { field: 'category_id' },
              sub_id: { field: 'category_sub_id' },
            },
            select: true,
          },
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

      await expect(
        applyJoins(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: {
                    id: { field: 'category_id' },
                    sub_id: { field: 'category_sub_id' },
                  },
                  select: true,
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: {
              id: { field: 'category_id' },
              sub_id: { field: 'category_sub_id' },
            },
            select: true,
          },
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

      await expect(
        applyJoins(
          {
            innerJoin: {
              category: [
                {
                  collection: { name: 'category' } as never,
                  by: { id: { field: 'category_id' } },
                  select: true,
                  innerJoin: {
                    menu: [
                      {
                        collection: { name: 'menu' } as never,
                        by: { id: { field: 'menu_id' } },
                        select: true,
                      },
                    ],
                  },
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
            select: true,
            innerJoin: {
              menu: [
                {
                  collection: { name: 'menu' } as never,
                  by: { id: { field: 'menu_id' } },
                  select: true,
                },
              ],
            },
          },
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
          options: {
            collection: { name: 'menu' } as never,
            by: { id: { field: 'menu_id' } },
            select: true,
          },
          project: null,
          find: { id: { $in: [1, 2] } },
          limit: 2,
        },
        expect.any(AbortSignal),
      );
    });
  });
});
