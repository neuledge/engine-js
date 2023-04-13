import { PostgreSQLStore } from './store';

describe('store', () => {
  describe('PostgreSQLStore()', () => {
    describe('.constructor()', () => {
      it('should be able to create a new store', () => {
        const store = new PostgreSQLStore({
          pool: {} as never,
        });

        expect(store).toBeInstanceOf(PostgreSQLStore);
      });
    });

    describe('.close()', () => {
      it('should be able to close the store', async () => {
        const end = jest.fn();

        const store = new PostgreSQLStore({
          pool: { end } as never,
        });

        expect(store).toBeInstanceOf(PostgreSQLStore);
        expect(end).toHaveBeenCalledTimes(0);

        await store.close();
        expect(end).toHaveBeenCalledTimes(1);
      });
    });
  });
});
