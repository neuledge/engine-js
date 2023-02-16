import { StoreJoin } from '@neuledge/store';
import { applyJoinQuery, getJoinQueries } from './join';

/* eslint-disable max-lines-per-function */

describe('join', () => {
  describe('getJoinQueries()', () => {
    it('should return an empty array if no join is provided', () => {
      expect(getJoinQueries({}, [{ id: 1 }])).toEqual({});
    });

    it('should join by post.category_id', () => {
      const join: StoreJoin = {
        category: [
          {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
          },
        ],
      };
      const docs = [
        { id: 101, category_id: 1 },
        { id: 102, category_id: 1 },
        { id: 103, category_id: 2 },
      ];

      expect(getJoinQueries(join, docs)).toEqual({
        category: [
          {
            options: join.category[0],
            collection: { name: 'category' },
            project: { id: 1 },
            find: {
              id: { $in: [1, 2] },
            },
            limit: 2,
          },
        ],
      });
    });

    it('should join by post.category_id with same category', () => {
      const join: StoreJoin = {
        category: [
          {
            collection: { name: 'category' } as never,
            by: { id: { field: 'category_id' } },
            select: true,
          },
        ],
      };
      const docs = [
        { id: 101, category_id: 1 },
        { id: 102, category_id: 1 },
        { id: 103, category_id: 1 },
      ];

      expect(getJoinQueries(join, docs)).toEqual({
        category: [
          {
            options: join.category[0],
            collection: { name: 'category' },
            project: null,
            find: {
              id: { $eq: 1 },
            },
            limit: 1,
          },
        ],
      });
    });

    it('should join by post.category_id and single post.category_sub_id', () => {
      const join: StoreJoin = {
        category: [
          {
            collection: { name: 'category' } as never,
            by: {
              id: { field: 'category_id' },
              sub_id: { field: 'category_sub_id' },
            },
          },
        ],
      };
      const docs = [
        { id: 101, category_id: 1, category_sub_id: 1 },
        { id: 102, category_id: 1, category_sub_id: 1 },
        { id: 103, category_id: 2, category_sub_id: 1 },
      ];

      expect(getJoinQueries(join, docs)).toEqual({
        category: [
          {
            options: join.category[0],
            collection: { name: 'category' },
            project: { id: 1, sub_id: 1 },
            find: {
              id: { $in: [1, 2] },
              sub_id: { $eq: 1 },
            },
            limit: 2,
          },
        ],
      });
    });

    it('should join by post.category_id and multiple post.category_sub_id', () => {
      const join: StoreJoin = {
        category: [
          {
            collection: { name: 'category' } as never,
            by: {
              id: { field: 'category_id' },
              sub_id: { field: 'category_sub_id' },
            },
            select: { name: true },
          },
        ],
      };
      const docs = [
        { id: 101, category_id: 1, category_sub_id: 1 },
        { id: 102, category_id: 1, category_sub_id: 2 },
        { id: 103, category_id: 2, category_sub_id: 1 },
      ];

      expect(getJoinQueries(join, docs)).toEqual({
        category: [
          {
            options: join.category[0],
            collection: { name: 'category' },
            project: { id: 1, sub_id: 1, name: 1 },
            find: {
              $or: [
                { id: { $eq: 1 }, sub_id: { $eq: 1 } },
                { id: { $eq: 1 }, sub_id: { $eq: 2 } },
                { id: { $eq: 2 }, sub_id: { $eq: 1 } },
              ],
            },
            limit: 3,
          },
        ],
      });
    });
  });

  describe('applyJoinQuery()', () => {
    it('should apply join query', () => {
      expect(
        applyJoinQuery(
          [
            { id: 1, category_id: 1 },
            { id: 2, category_id: 1 },
            { id: 3, category_id: 2 },
            { id: 4, category_id: 3 },
          ],
          'category',
          [{ select: true, by: { id: { field: 'category_id' } } } as never],
          [
            [
              { id: 1, name: 'Category 1' },
              { id: 2, name: 'Category 2' },
            ],
          ],
        ),
      ).toEqual([
        { id: 1, category_id: 1, category: { id: 1, name: 'Category 1' } },
        { id: 2, category_id: 1, category: { id: 1, name: 'Category 1' } },
        { id: 3, category_id: 2, category: { id: 2, name: 'Category 2' } },
        { id: 4, category_id: 3 },
      ]);
    });

    it('should apply required join query', () => {
      expect(
        applyJoinQuery(
          [
            { id: 1, category_id: 1 },
            { id: 2, category_id: 1 },
            { id: 3, category_id: 2 },
            { id: 4, category_id: 3 },
          ],
          'category',
          [{ select: true, by: { id: { field: 'category_id' } } } as never],
          [
            [
              { id: 1, name: 'Category 1' },
              { id: 2, name: 'Category 2' },
            ],
          ],
          true,
        ),
      ).toEqual([
        { id: 1, category_id: 1, category: { id: 1, name: 'Category 1' } },
        { id: 2, category_id: 1, category: { id: 1, name: 'Category 1' } },
        { id: 3, category_id: 2, category: { id: 2, name: 'Category 2' } },
      ]);
    });

    it('should apply required join query no select', () => {
      expect(
        applyJoinQuery(
          [
            { id: 1, category_id: 1 },
            { id: 2, category_id: 1 },
            { id: 3, category_id: 2 },
            { id: 4, category_id: 3 },
          ],
          'category',
          [{ by: { id: { field: 'category_id' } } } as never],
          [
            [
              { id: 1, name: 'Category 1' },
              { id: 2, name: 'Category 2' },
            ],
          ],
          true,
        ),
      ).toEqual([
        { id: 1, category_id: 1 },
        { id: 2, category_id: 1 },
        { id: 3, category_id: 2 },
      ]);
    });
  });
});
