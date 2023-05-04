import { StoreCollection } from '@neuledge/store';
import { QueryHelpers } from './query';
import { getFromJoins } from './join';

/* eslint-disable max-lines-per-function */

describe('helpers/join', () => {
  describe('getFromJoins()', () => {
    const helpers: QueryHelpers = {
      encodeIdentifier: (name) => `\`${name.replace(/([\\`])/g, '\\$1')}\``,
      encodeLiteral: (value) => JSON.stringify(value),
    };

    const collection: StoreCollection = {
      name: 'collection',
      primaryKey: { fields: { id: true } },
      fields: { id: true, name: true, foo: true, bar: true },
    } as never;

    const otherCollection: StoreCollection = {
      name: 'otherCollection',
      primaryKey: { fields: { id: true, subId: true } },
      fields: { id: true, subId: true, title: true, description: true },
    } as never;

    const otherCollection2: StoreCollection = {
      name: 'otherCollection2',
      primaryKey: { fields: { id: true } },
      fields: { id: true, image: true, url: true },
    } as never;

    it('should return null if no joins', () => {
      expect(
        getFromJoins(helpers, {
          collection,
        }),
      ).toBeNull();
    });

    it('should handle simple single inner join', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          innerJoin: {
            foo: [
              {
                collection: otherCollection,
                select: true,
                by: { id: { field: 'foo' } },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: [
          '`foo$0`.`id` AS `foo$0.id`',
          '`foo$0`.`subId` AS `foo$0.subId`',
          '`foo$0`.`title` AS `foo$0.title`',
          '`foo$0`.`description` AS `foo$0.description`',
        ],
        fromAlias: '$',
        fromJoins: [
          'INNER JOIN `otherCollection` `foo$0` ON (`foo$0`.`id` = `$`.`foo`)',
        ],
        whereClauses: [],
      });
    });

    it('should handle simple single left join', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          leftJoin: {
            foo: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { id: { field: 'foo' }, subId: { field: 'bar' } },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: ['`foo$0`.`title` AS `foo$0.title`'],
        fromAlias: '$',
        fromJoins: [
          'LEFT JOIN `otherCollection` `foo$0` ON (`foo$0`.`id` = `$`.`foo` AND `foo$0`.`subId` = `$`.`bar`)',
        ],
        whereClauses: [],
      });
    });

    it('should handle multiple joins', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          innerJoin: {
            foo: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { id: { field: 'foo' } },
              },
            ],
          },
          leftJoin: {
            bar: [
              {
                collection: otherCollection,
                select: { description: true },
                by: { subId: { field: 'bar' } },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: [
          '`foo$0`.`title` AS `foo$0.title`',
          '`bar$0`.`description` AS `bar$0.description`',
        ],
        fromAlias: '$',
        fromJoins: [
          'INNER JOIN `otherCollection` `foo$0` ON (`foo$0`.`id` = `$`.`foo`)',
          'LEFT JOIN `otherCollection` `bar$0` ON (`bar$0`.`subId` = `$`.`bar`)',
        ],
        whereClauses: [],
      });
    });

    it('should handle multiple inner join choices on same collection', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          innerJoin: {
            foo: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { id: { field: 'foo' } },
              },
              {
                collection: otherCollection,
                select: { title: true },
                by: { subId: { field: 'bar' } },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: [
          '`foo$0`.`title` AS `foo$0.title`',
          '`foo$0`.`title` AS `foo$1.title`',
        ],
        fromAlias: '$',
        fromJoins: [
          'INNER JOIN `otherCollection` `foo$0` ON (`foo$0`.`id` = `$`.`foo`) OR (`foo$0`.`subId` = `$`.`bar`)',
        ],
        whereClauses: [],
      });
    });

    it('should handle multiple inner join choices on different collections', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          innerJoin: {
            foo: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { subId: { field: 'foo' } },
              },
              {
                collection: otherCollection2,
                select: { url: true },
                by: { id: { field: 'bar' } },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: [
          '`foo$0`.`title` AS `foo$0.title`',
          '`foo$1`.`url` AS `foo$1.url`',
        ],
        fromAlias: '$',
        fromJoins: [
          'LEFT JOIN `otherCollection` `foo$0` ON (`foo$0`.`subId` = `$`.`foo`)',
          'LEFT JOIN `otherCollection2` `foo$1` ON (`foo$1`.`id` = `$`.`bar`)',
        ],
        whereClauses: [
          '(`foo$0`.`id` IS NOT NULL) OR (`foo$1`.`id` IS NOT NULL)',
        ],
      });
    });

    it('should handle inner join with where', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          innerJoin: {
            foo: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { id: { field: 'foo' } },
                where: { subId: { $eq: 123 } },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: ['`foo$0`.`title` AS `foo$0.title`'],
        fromAlias: '$',
        fromJoins: [
          'INNER JOIN `otherCollection` `foo$0` ON (`foo$0`.`id` = `$`.`foo` AND `foo$0`.`subId` = 123)',
        ],
        whereClauses: [],
      });
    });

    it('should handle left joins with where', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          leftJoin: {
            foo: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { id: { field: 'foo' } },
                where: { subId: { $lt: 123 } },
              },
              {
                collection: otherCollection,
                select: { description: true },
                by: { subId: { field: 'bar' } },
                where: { title: { $eq: 'hello' } },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: [
          '`foo$0`.`title` AS `foo$0.title`',
          '`foo$0`.`description` AS `foo$1.description`',
        ],
        fromAlias: '$',
        fromJoins: [
          'LEFT JOIN `otherCollection` `foo$0` ON (`foo$0`.`id` = `$`.`foo` AND `foo$0`.`subId` < 123) OR (`foo$0`.`subId` = `$`.`bar` AND `foo$0`.`title` = "hello")',
        ],
        whereClauses: [],
      });
    });

    it('should handle inner join within left join', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          leftJoin: {
            foo: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { id: { field: 'foo' } },
                innerJoin: {
                  bar: [
                    {
                      collection: otherCollection2,
                      select: { url: true },
                      by: { id: { field: 'bar' } },
                    },
                  ],
                },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: [
          '`foo$0`.`title` AS `foo$0.title`',
          '`foo$0.bar$0`.`url` AS `foo$0.bar$0.url`',
        ],
        fromAlias: '$',
        fromJoins: [
          'LEFT JOIN `otherCollection` `foo$0` ON (`foo$0`.`id` = `$`.`foo`)',
          'INNER JOIN `otherCollection2` `foo$0.bar$0` ON (`foo$0.bar$0`.`id` = `foo$0`.`bar`)',
        ],
        whereClauses: [],
      });
    });

    it('should handle overlapping inner join within left join', () => {
      expect(
        getFromJoins(helpers, {
          collection,
          leftJoin: {
            test: [
              {
                collection: otherCollection,
                select: { title: true },
                by: { id: { field: 'foo' } },
                innerJoin: {
                  test: [
                    {
                      collection: otherCollection2,
                      select: { url: true },
                      by: { id: { field: 'bar' } },
                    },
                  ],
                },
              },
            ],
          },
        }),
      ).toEqual({
        selectColumns: [
          '`test$0`.`title` AS `test$0.title`',
          '`test$0.test$0`.`url` AS `test$0.test$0.url`',
        ],
        fromAlias: '$',
        fromJoins: [
          'LEFT JOIN `otherCollection` `test$0` ON (`test$0`.`id` = `$`.`foo`)',
          'INNER JOIN `otherCollection2` `test$0.test$0` ON (`test$0.test$0`.`id` = `test$0`.`bar`)',
        ],
        whereClauses: [],
      });
    });
  });
});
