import { NeuledgeEngine } from './engine.js';
import { EngineStore } from './store.js';

describe('Engine', () => {
  describe('NeuledgeEngine', () => {
    it('should constract', () => {
      const engine = new NeuledgeEngine({} as EngineStore);

      expect(engine);
    });
  });
});
