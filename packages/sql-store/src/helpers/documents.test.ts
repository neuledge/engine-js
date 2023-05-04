import { convertRawDocument } from './documents';

/* eslint-disable max-lines-per-function */

describe('helpers/documents', () => {
  describe('convertRawDocument()', () => {
    it('should convert raw document to nested document', () => {
      expect(
        convertRawDocument({
          id: 123,
          url: null,
          'foo$0.bar': 'baz',
          'foo$0.qux': 'quux',
          'foo$0.quux': 'corge',
          'foo$0.baz.qux': 'grault',
          'foo$0.baz.quux.corge.grault': 'fred',
        }),
      ).toEqual({
        id: 123,
        url: null,
        foo: {
          bar: 'baz',
          qux: 'quux',
          quux: 'corge',
          baz: {
            qux: 'grault',
            quux: {
              corge: {
                grault: 'fred',
              },
            },
          },
        },
      });
    });

    it('should prefer lower choices over higher choices (props asc)', () => {
      expect(
        convertRawDocument({
          id: 123,
          url: null,
          'foo$0.bar': 'baz',
          'foo$1.bar': 'qux',
          'foo$1.baz': 123,
        }),
      ).toEqual({
        id: 123,
        url: null,
        foo: {
          bar: 'baz',
        },
      });
    });

    it('should prefer lower choices over higher choices (props desc)', () => {
      expect(
        convertRawDocument({
          id: 123,
          url: null,
          'foo$1.bar': 'qux',
          'foo$1.baz': 123,
          'foo$0.bar': 'baz',
        }),
      ).toEqual({
        id: 123,
        url: null,
        foo: {
          bar: 'baz',
        },
      });
    });

    it('should prefer lower choices over higher choices (nested)', () => {
      expect(
        convertRawDocument({
          id: 123,
          url: null,
          'foo$0.id': 123,
          'foo$0.bar$0.id': 1,
          'foo$0.bar$1.id': 2,
          'foo$1.id': 456,
          'foo$1.bar$0.id': 3,
          'foo$1.bar$1.id': 4,
        }),
      ).toEqual({
        id: 123,
        url: null,
        foo: {
          id: 123,
          bar: {
            id: 1,
          },
        },
      });
    });
  });
});
