import { StoreCollection } from '@neuledge/store';
import { escapeDocument, unescapeDocument } from './documents';

/* eslint-disable max-lines-per-function */

describe('documents', () => {
  const idCollection: StoreCollection = {
    name: 'test',
    fields: {} as never,
    primaryKey: {
      name: 'id',
      fields: { id: { sort: 'asc' } },
      unique: 'primary',
    },
    indexes: [] as never,
  };

  const multiCollection: StoreCollection = {
    name: 'test',
    fields: {} as never,
    primaryKey: {
      name: 'id_sub_id',
      fields: { id: { sort: 'asc' }, sub_id: { sort: 'asc' } },
      unique: 'primary',
    },
    indexes: [] as never,
  };

  const _idCollection: StoreCollection = {
    name: 'test',
    fields: {} as never,
    primaryKey: {
      name: '_id',
      fields: { _id: { sort: 'asc' } },
      unique: 'primary',
    },
    indexes: [] as never,
  };

  const _multiCollection: StoreCollection = {
    name: 'test',
    fields: {} as never,
    primaryKey: {
      name: '_id_sub_iq',
      fields: { _id: { sort: 'asc' }, sub_id: { sort: 'asc' } },
      unique: 'primary',
    },
    indexes: [] as never,
  };

  describe('escapeDocument()', () => {
    it('should escape the document with single primary key', () => {
      expect(escapeDocument(idCollection, { id: 123, foo: 'bar' })).toEqual({
        _id: 123,
        foo: 'bar',
      });
    });

    it('should escape the document with existing _id field', () => {
      expect(escapeDocument(idCollection, { id: 123, _id: 456 })).toEqual({
        _id: 123,
        _id_org: 456,
      });
    });

    it('should escape the document with _id as primary key', () => {
      expect(
        escapeDocument(_idCollection, { _id: 123, id: 456, foo: 'bar' }),
      ).toEqual({
        _id: 123,
        id: 456,
        foo: 'bar',
      });
    });

    it('should escape the document with multiple primary keys', () => {
      expect(
        escapeDocument(multiCollection, { id: 123, sub_id: 789, foo: 'bar' }),
      ).toEqual({
        _id: {
          id: 123,
          sub_id: 789,
        },
        foo: 'bar',
      });
    });

    it('should escape the document with multiple primary keys and existing _id field', () => {
      expect(
        escapeDocument(multiCollection, {
          id: 123,
          sub_id: 789,
          _id: 456,
          foo: 'bar',
        }),
      ).toEqual({
        _id: {
          id: 123,
          sub_id: 789,
        },
        _id_org: 456,
        foo: 'bar',
      });
    });

    it('should escape the document with multiple primary keys and _id as primary key', () => {
      expect(
        escapeDocument(_multiCollection, {
          _id: 456,
          sub_id: 789,
          id: 123,
          foo: 'bar',
        }),
      ).toEqual({
        _id: {
          _id: 456,
          sub_id: 789,
        },
        id: 123,
        foo: 'bar',
      });
    });
  });

  describe('unescapeDocument()', () => {
    it('should unescape the document with single primary key', () => {
      expect(unescapeDocument(idCollection, { _id: 123, foo: 'bar' })).toEqual({
        id: 123,
        foo: 'bar',
      });
    });

    it('should unescape the document with existing _id field', () => {
      expect(
        unescapeDocument(idCollection, { _id: 123, _id_org: 456 }),
      ).toEqual({
        id: 123,
        _id: 456,
      });
    });

    it('should unescape the document with _id as primary key', () => {
      expect(
        unescapeDocument(_idCollection, { _id: 123, id: 456, foo: 'bar' }),
      ).toEqual({
        _id: 123,
        id: 456,
        foo: 'bar',
      });
    });

    it('should unescape the document with multiple primary keys', () => {
      expect(
        unescapeDocument(multiCollection, {
          _id: {
            id: 123,
            sub_id: 789,
          },
          foo: 'bar',
        }),
      ).toEqual({
        id: 123,
        sub_id: 789,
        foo: 'bar',
      });
    });

    it('should unescape the document with multiple primary keys and existing _id field', () => {
      expect(
        unescapeDocument(multiCollection, {
          _id: {
            id: 123,
            sub_id: 789,
          },
          foo: 'bar',
          _id_org: 456,
        }),
      ).toEqual({
        id: 123,
        sub_id: 789,
        foo: 'bar',
        _id: 456,
      });
    });

    it('should unescape the document with multiple primary keys and _id as primary key', () => {
      expect(
        unescapeDocument(_multiCollection, {
          _id: {
            _id: 456,
            sub_id: 789,
          },
          id: 123,
          foo: 'bar',
        }),
      ).toEqual({
        _id: 456,
        sub_id: 789,
        id: 123,
        foo: 'bar',
      });
    });
  });
});
