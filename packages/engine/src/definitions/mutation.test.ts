import {
  StateDefinitionMutationArguments,
  StateDefintionMutations,
  StateDefinitionCreateMutations,
  StateDefinitionDeleteMutations,
  StateDefinitionUpdateWithoutArgsMutations,
  StateDefinitionUpdateWithArgsMutations,
  StateDefinitionMutationsReturn,
} from './mutation';
import { StateDefinitionId } from './state';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from './__test__/category-post-example';

/* eslint-disable max-lines-per-function */

describe('generated/mutation', () => {
  describe('StateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1; update: 1; delete: 1 }>(
        {} as Record<StateDefintionMutations<typeof Category>, 1>,
      );

      expect<{ create: 1; update: 1; publish: 1; delete: 1 }>(
        {} as Record<StateDefintionMutations<typeof DraftPost>, 1>,
      );

      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateDefintionMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateDefintionMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateCreateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1 }>(
        {} as Record<StateDefinitionCreateMutations<typeof Category>, 1>,
      );
      expect<{ create: 1 }>(
        {} as Record<StateDefinitionCreateMutations<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateDefinitionCreateMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateDefinitionCreateMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateUpdateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<
          StateDefinitionUpdateWithArgsMutations<typeof Category>,
          1
        >,
      );
      expect<{ update: 1 }>(
        {} as Record<
          StateDefinitionUpdateWithArgsMutations<typeof DraftPost>,
          1
        >,
      );
      expect<{ update: 1 }>(
        {} as Record<
          StateDefinitionUpdateWithArgsMutations<typeof PublishedPost>,
          1
        >,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<
          StateDefinitionUpdateWithArgsMutations<typeof Post[number]>,
          1
        >,
      );
    });
  });

  describe('StateTransformMethods<>', () => {
    it('should have single state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionUpdateWithoutArgsMutations<typeof Category>,
          1
        >,
      );
      expect<{ publish: 1 }>(
        {} as Record<
          StateDefinitionUpdateWithoutArgsMutations<typeof DraftPost>,
          1
        >,
      );
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionUpdateWithoutArgsMutations<typeof PublishedPost>,
          1
        >,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionUpdateWithoutArgsMutations<typeof Post[number]>,
          1
        >,
      );
    });
  });

  describe('StateDeleteMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDefinitionDeleteMutations<typeof Category>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDefinitionDeleteMutations<typeof DraftPost>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDefinitionDeleteMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDefinitionDeleteMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateMethodArguments<>', () => {
    it('should have single state method arguments', () => {
      expect<{
        name: string;
        description?: string | null;
      }>({} as StateDefinitionMutationArguments<typeof Category, 'create'>);

      expect<{
        title: string;
        content?: string | null;
        category?: StateDefinitionId<typeof Category> | null;
      }>({} as StateDefinitionMutationArguments<typeof DraftPost, 'update'>);

      expect<Record<string, never>>(
        {} as StateDefinitionMutationArguments<typeof DraftPost, 'publish'>,
      );

      expect<Record<string, never>>(
        {} as StateDefinitionMutationArguments<typeof PublishedPost, 'delete'>,
      );
    });

    it('should have multiple states method arguments', () => {
      expect<{
        title: string;
        content: string;
        category: StateDefinitionId<typeof Category>;
      }>({} as StateDefinitionMutationArguments<typeof Post[number], 'update'>);

      expect<Record<string, never>>(
        {} as StateDefinitionMutationArguments<typeof Post[number], 'delete'>,
      );
    });
  });

  describe('StateMethodReturn<>', () => {
    it('should have single state method return', () => {
      expect<typeof Category>(
        {} as StateDefinitionMutationsReturn<typeof Category, 'create'>,
      );

      expect<typeof DraftPost>(
        {} as StateDefinitionMutationsReturn<typeof DraftPost, 'update'>,
      );

      expect<typeof PublishedPost>(
        {} as StateDefinitionMutationsReturn<typeof DraftPost, 'publish'>,
      );

      expect<never>(
        {} as StateDefinitionMutationsReturn<typeof PublishedPost, 'delete'>,
      );
    });

    it('should have multiple states method return', () => {
      expect<typeof DraftPost | typeof PublishedPost>(
        {} as StateDefinitionMutationsReturn<typeof Post[number], 'update'>,
      );

      expect<never>(
        {} as StateDefinitionMutationsReturn<typeof Post[number], 'delete'>,
      );
    });
  });
});
