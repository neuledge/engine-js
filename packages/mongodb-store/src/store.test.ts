import { MongoDBStore } from './store';

describe('store', () => {
  describe('MongoDBStore()', () => {
    it('should create a new MongoDBStore instance', () => {
      const store = new MongoDBStore('mongodb://localhost:27017', 'test');

      expect(store).toBeInstanceOf(MongoDBStore);
    });
  });
});
