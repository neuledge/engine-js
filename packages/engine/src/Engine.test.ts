import { NeuledgeEngine } from './Engine.js';
import { EngineStore } from './Store.js';

describe('Engine', () => {
  describe('NeuledgeEngine', () => {
    it('should constract', () => {
      const engine = new NeuledgeEngine({} as EngineStore);

      expect(engine);
    });
  });
});
