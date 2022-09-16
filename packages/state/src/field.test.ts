import { StateFieldType } from './field.js';

describe('Field', () => {
  describe('StateFieldType<>', () => {
    it('should accept scalar', () => {
      expect<StateFieldType>({ encode: String });
    });

    it('should accept list of scalars', () => {
      expect<StateFieldType>([{ encode: String }]);
    });

    it('should accept state', () => {
      expect<StateFieldType>([{ key: 'Test', schema: {}, mutations: {} }]);
    });

    it('should accept multiple states', () => {
      expect<StateFieldType>([
        { key: 'Test', schema: {}, mutations: {} },
        { key: 'Test2', schema: {}, mutations: {} },
      ]);
    });

    it('should accept list of states', () => {
      expect<StateFieldType>([
        [
          { key: 'Test', schema: {}, mutations: {} },
          { key: 'Test2', schema: {}, mutations: {} },
        ],
      ]);
    });
  });
});
