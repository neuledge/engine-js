import { NeuledgeEngine } from './engine.js';

describe('Engine', () => {
  describe('NeuledgeEngine', () => {
    it('should constract', async () => {
      const engine = new NeuledgeEngine({} as never);

      expect(engine);
    });
  });
});
