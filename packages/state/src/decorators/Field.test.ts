import { Field, FieldMetadata, getFieldMetadata } from './Field.js';

/* eslint-disable max-lines-per-function */

describe('decorators/Field', () => {
  describe('@Field()', () => {
    it('should added to a state field', () => {
      class State {
        @Field(1, String)
        field!: string;
      }

      expect(new State());
    });
  });

  describe('getFieldMetadata()', () => {
    it('should get state field metadata', () => {
      class State {
        @Field(1, String)
        field!: string;
      }

      const state = new State();

      expect<FieldMetadata | undefined>(
        getFieldMetadata(state, 'field'),
      ).toEqual<FieldMetadata>({
        index: 1,
        type: { encode: String },
        nullable: false,
      });
    });

    it('should get nullable state field metadata', () => {
      class State {
        @Field(1, String, { nullable: true })
        field?: string | null;
      }

      const state = new State();

      expect<FieldMetadata | undefined>(
        getFieldMetadata(state, 'field'),
      ).toEqual<FieldMetadata>({
        index: 1,
        type: { encode: String },
        nullable: true,
      });
    });

    it('should not get state field metadata for unknown field', () => {
      class State {
        @Field(1, String)
        field!: string;

        field2!: string;
      }

      const state = new State();

      expect<FieldMetadata | undefined>(
        getFieldMetadata(state, 'field2'),
      ).toEqual(undefined);
    });
  });
});
