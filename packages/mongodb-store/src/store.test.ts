import { MongoDBStore } from './store';

describe('store', () => {
  describe('MongoDBStore()', () => {
    it('should create a new MongoDBStore instance', () => {
      const store = new MongoDBStore({
        url: 'mongodb://localhost:27017',
        name: 'test',
      });

      expect(store).toBeInstanceOf(MongoDBStore);
    });
  });
});
