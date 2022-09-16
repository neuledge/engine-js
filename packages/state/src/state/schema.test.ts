import { StateSchema } from './schema.js';

describe('Schema', () => {
  describe('StateSchema<>', () => {
    it('should allow either primary key or nullable', () => {
      expect<StateSchema>({
        id: { index: 1, type: { encode: Number }, primaryKey: true },
        name: { index: 2, type: { encode: String }, nullable: false },
        email: {
          index: 3,
          type: { encode: String },
          nullable: true,
          primaryKey: undefined,
        },
      });
    });
  });
});
