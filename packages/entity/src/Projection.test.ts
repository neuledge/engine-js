import { Scalar } from '@neuledge/scalar';
import { ArrayType, State, UnionType } from '@neuledge/state';
import { EntityListOffset } from './List.js';
import { Projection, ProjectionFalse, ProjectionFlag } from './Projection.js';

/* eslint-disable max-lines-per-function */

describe('Projection', () => {
  describe('Projection<>', () => {
    it('should allow only schema types', () => {
      type schema = State<
        'Test',
        {
          id: { index: 1; type: Scalar<number>; primaryKey: true };
          name: { index: 1; type: Scalar<string> };
          email: { index: 1; type: Scalar<string>; nullable: true };
          keywords: { index: 1; type: ArrayType<Scalar<string>> };
          parent: { index: 1; type: UnionType<schema>; nullable: true };
          children: { index: 1; type: ArrayType<UnionType<schema>> };
        }
      >;

      type proj = Projection<schema>;

      expect<{
        id?: ProjectionFlag;
        name?: ProjectionFlag;
        email?: ProjectionFlag;
        keywords?: ProjectionFlag | [(number | null)?, EntityListOffset?];
        self?: proj | ProjectionFalse;
        children?:
          | [proj, (number | null)?, EntityListOffset?]
          | ProjectionFalse;
      }>({} as proj);
    });

    it('should allow scalar array', () => {
      type schema = State<
        'Test',
        {
          keywords: { index: 1; type: ArrayType<Scalar<string>> };
        }
      >;

      type proj = Projection<schema>;

      expect<proj>({
        keywords: 1,
      });

      expect<proj>({
        keywords: [10, 4],
      });
    });

    it('should allow state relation', () => {
      type schema = State<
        'Test',
        {
          self: { index: 1; type: UnionType<schema> };
        }
      >;

      type proj = Projection<schema>;

      expect<proj>({
        self: {},
      });

      expect<proj>({
        self: { self: { self: false } },
      });
    });

    it('should allow state relation array', () => {
      type schema = State<
        'Test',
        {
          self: { index: 1; type: ArrayType<UnionType<schema>> };
        }
      >;

      type proj = Projection<schema>;

      expect<proj>({
        self: [{}],
      });

      expect<proj>({
        self: [{ self: [{ self: false }] }, 10, 5],
      });
    });
  });
});
