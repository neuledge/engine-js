import {
  Category,
  Post,
} from '@/definitions/__fixtures__/category-post-example';
import { MetadataCollection } from './collection';
import { Metadata } from './metadata';

/* eslint-disable max-lines-per-function */

describe('engine/metadata/collection', () => {
  describe('MetadataCollection()', () => {
    let categoriesCollection: MetadataCollection;
    let postsCollection: MetadataCollection;

    beforeAll(() => {
      const metadata = new Metadata([Category, ...Post]);

      categoriesCollection = metadata.getCollections([Category])[0];
      postsCollection = metadata.getCollections(Post)[0];
    });

    describe('.fields', () => {
      it('should match category fields', () => {
        expect(categoriesCollection.fields).toEqual({
          id: {
            name: 'id',
            type: 'json',
            nullable: false,
          },
          name: {
            name: 'name',
            type: 'json',
            nullable: false,
          },
          description: {
            name: 'description',
            type: 'json',
            nullable: true,
          },
        });
      });

      it('should match post fields', () => {
        expect(postsCollection.fields).toEqual({
          id: {
            name: 'id',
            type: 'json',
            nullable: false,
          },
          title: {
            name: 'title',
            type: 'json',
            nullable: false,
          },
          content: {
            name: 'content',
            type: 'json',
            nullable: true,
          },
          category_id: {
            name: 'category_id',
            type: 'json',
            nullable: true,
          },
          published_at: {
            name: 'published_at',
            type: 'json',
            nullable: true,
          },
        });
      });
    });

    describe('.primaryKey', () => {
      it('should match category primary key', () => {
        expect(categoriesCollection.primaryKey).toMatchObject({
          unique: 'primary',
        });

        expect(categoriesCollection.primaryKey).toBe(
          categoriesCollection.indexes[categoriesCollection.primaryKey.name],
        );
      });

      it('should match post primary key', () => {
        expect(postsCollection.primaryKey).toMatchObject({
          unique: 'primary',
        });

        expect(postsCollection.primaryKey).toBe(
          postsCollection.indexes[postsCollection.primaryKey.name],
        );
      });
    });

    describe('.indexes', () => {
      it('should match category indexes', () => {
        expect(categoriesCollection.indexes).toEqual({
          id: {
            name: 'id',
            fields: { id: { direction: 'asc' } },
            unique: 'primary',
            auto: 'increment',
          },
        });
      });

      it('should match post indexes', () => {
        expect(postsCollection.indexes).toEqual({
          id: {
            name: 'id',
            fields: { id: { direction: 'asc' } },
            unique: 'primary',
            auto: 'increment',
          },
          category_title: {
            name: 'category_title',
            fields: {
              category_id: { direction: 'asc' },
              title: { direction: 'asc' },
            },
          },
        });
      });
    });
  });
});
