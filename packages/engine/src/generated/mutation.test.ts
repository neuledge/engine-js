import {
  StateMethodArguments,
  StateMethods,
  StateCreateMethods,
  StateDeleteMethods,
  StateTransformMethods,
  StateUpdateMethods,
  StateMethodReturn,
} from './mutation.js';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from './__test__/category-post-example.js';

/* eslint-disable max-lines-per-function */

describe('generated/mutation', () => {
  describe('StateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1; update: 1; delete: 1 }>(
        {} as Record<StateMethods<typeof Category>, 1>,
      );

      expect<{ create: 1; update: 1; publish: 1; delete: 1 }>(
        {} as Record<StateMethods<typeof DraftPost>, 1>,
      );

      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateMethods<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateCreateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1 }>(
        {} as Record<StateCreateMethods<typeof Category>, 1>,
      );
      expect<{ create: 1 }>(
        {} as Record<StateCreateMethods<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateCreateMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateCreateMethods<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateUpdateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<StateUpdateMethods<typeof Category>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<StateUpdateMethods<typeof DraftPost>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<StateUpdateMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<StateUpdateMethods<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateTransformMethods<>', () => {
    it('should have single state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateTransformMethods<typeof Category>, 1>,
      );
      expect<{ publish: 1 }>(
        {} as Record<StateTransformMethods<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateTransformMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateTransformMethods<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateDeleteMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMethods<typeof Category>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMethods<typeof DraftPost>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMethods<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateMethodArguments<>', () => {
    it('should have single state method arguments', () => {
      expect<{
        name: string;
        description?: string | null;
      }>({} as StateMethodArguments<typeof Category, 'create'>);

      expect<{
        title: string;
        content?: string | null;
        category?: typeof Category['$id'] | null;
      }>({} as StateMethodArguments<typeof DraftPost, 'update'>);

      expect<Record<string, never>>(
        {} as StateMethodArguments<typeof DraftPost, 'publish'>,
      );

      expect<Record<string, never>>(
        {} as StateMethodArguments<typeof PublishedPost, 'delete'>,
      );
    });

    it('should have multiple states method arguments', () => {
      expect<{
        title: string;
        content: string;
        category: typeof Category['$id'];
      }>({} as StateMethodArguments<typeof Post[number], 'update'>);

      expect<Record<string, never>>(
        {} as StateMethodArguments<typeof Post[number], 'delete'>,
      );
    });
  });

  describe('StateMethodReturn<>', () => {
    it('should have single state method return', () => {
      expect<typeof Category>(
        {} as StateMethodReturn<typeof Category, 'create'>,
      );

      expect<typeof DraftPost>(
        {} as StateMethodReturn<typeof DraftPost, 'update'>,
      );

      expect<typeof PublishedPost>(
        {} as StateMethodReturn<typeof DraftPost, 'publish'>,
      );

      expect<never>({} as StateMethodReturn<typeof PublishedPost, 'delete'>);
    });

    it('should have multiple states method return', () => {
      expect<typeof DraftPost | typeof PublishedPost>(
        {} as StateMethodReturn<typeof Post[number], 'update'>,
      );

      expect<never>({} as StateMethodReturn<typeof Post[number], 'delete'>);
    });
  });
});
