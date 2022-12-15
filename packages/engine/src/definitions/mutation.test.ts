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
} from './__fixtures__/category-post-example';

/* eslint-disable max-lines-per-function */

describe('generated/mutation', () => {
  describe('StateDefintionMutations<>', () => {
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

  describe('StateDefinitionCreateMutations<>', () => {
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

  describe('StateDefinitionUpdateWithArgsMutations<>', () => {
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

  describe('StateDefinitionUpdateWithoutArgsMutations<>', () => {
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
      expect<StateDefinitionUpdateWithoutArgsMutations<typeof Post[number]>>(
        {} as never,
      );
      expect<never>(
        {} as StateDefinitionUpdateWithoutArgsMutations<typeof Post[number]>,
      );
    });
  });

  describe('StateDefinitionDeleteMutations<>', () => {
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

  describe('StateDefinitionMutationArguments<>', () => {
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

  describe('StateDefinitionMutationsReturn<>', () => {
    it('should have single state method return', () => {
      expect<StateDefinitionMutationsReturn<typeof Category, 'create'>>(
        Category,
      );

      expect<StateDefinitionMutationsReturn<typeof Category, 'update'>>(
        Category,
      );

      expect<StateDefinitionMutationsReturn<typeof Category, 'delete'>>(
        null as never,
      );

      expect<StateDefinitionMutationsReturn<typeof DraftPost, 'update'>>(
        DraftPost,
      );

      expect<StateDefinitionMutationsReturn<typeof DraftPost, 'publish'>>(
        PublishedPost,
      );

      expect<StateDefinitionMutationsReturn<typeof DraftPost, 'delete'>>(
        null as never,
      );

      expect<StateDefinitionMutationsReturn<typeof PublishedPost, 'update'>>(
        PublishedPost,
      );

      expect<StateDefinitionMutationsReturn<typeof PublishedPost, 'delete'>>(
        null as never,
      );
    });

    it('should have multiple states method return', () => {
      expect<StateDefinitionMutationsReturn<typeof Post[number], 'update'>>(
        DraftPost as typeof Post[number],
      );

      expect<StateDefinitionMutationsReturn<typeof Post[number], 'delete'>>(
        null as never,
      );
    });
  });
});
