import { getStateMetadata, State, StateMetadata } from './State.js';

describe('decorators/State', () => {
  describe('@State()', () => {
    it('should added to a state', () => {
      @State(1)
      class MyState {}

      expect(new MyState());
    });
  });

  describe('getStateMetadata()', () => {
    it('should get state metadata', () => {
      @State(1)
      class MyState {}

      expect<StateMetadata | undefined>(
        getStateMetadata(new MyState()),
      ).toEqual<StateMetadata>({ index: 1 });
    });

    it('should not get state metadata for unknown class', () => {
      class MyState {}

      expect<StateMetadata | undefined>(
        getStateMetadata(new MyState()),
      ).toEqual(undefined);
    });
  });
});
