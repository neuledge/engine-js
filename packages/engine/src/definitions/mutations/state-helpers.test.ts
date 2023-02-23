import { StateId } from '../state';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from '../__fixtures__/category-post-example';
import {
  StateDefinitionAlterMethods,
  StateDefinitionAlterWithArgsMethods,
  StateDefinitionAlterWithoutArgsMethods,
  StateDefinitionInitMethods,
  StateDefinitionInitWithArgsMethods,
  StateDefinitionInitWithoutArgsMethods,
  StateDefinitionMethods,
  StateDefinitionMutationArguments,
  StateDefinitionMutationsReturn,
} from './state-helpers';

/* eslint-disable max-lines-per-function */

describe('definitions/mutations/state', () => {
  describe('StateDefintionMutations<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1; update: 1; delete: 1 }>(
        {} as Record<StateDefinitionMethods<typeof Category>, 1>,
      );

      expect<{ create: 1; update: 1; publish: 1; delete: 1 }>(
        {} as Record<StateDefinitionMethods<typeof DraftPost>, 1>,
      );

      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateDefinitionMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateDefinitionMethods<(typeof Post)[number]>, 1>,
      );
    });
  });

  describe('StateDefinitionInitMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1 }>(
        {} as Record<StateDefinitionInitMethods<typeof Category>, 1>,
      );
      expect<{ create: 1 }>(
        {} as Record<StateDefinitionInitMethods<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateDefinitionInitMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateDefinitionInitMethods<(typeof Post)[number]>, 1>,
      );
    });
  });

  describe('StateDefinitionInitWithArgsMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1 }>(
        {} as Record<StateDefinitionInitWithArgsMethods<typeof Category>, 1>,
      );
      expect<{ create: 1 }>(
        {} as Record<StateDefinitionInitWithArgsMethods<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionInitWithArgsMethods<typeof PublishedPost>,
          1
        >,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionInitWithArgsMethods<(typeof Post)[number]>,
          1
        >,
      );
    });
  });

  describe('StateDefinitionInitWithoutArgsMethods<>', () => {
    it('should have single state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateDefinitionInitWithoutArgsMethods<typeof Category>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionInitWithoutArgsMethods<typeof DraftPost>,
          1
        >,
      );
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionInitWithoutArgsMethods<typeof PublishedPost>,
          1
        >,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<
          StateDefinitionInitWithoutArgsMethods<(typeof Post)[number]>,
          1
        >,
      );
    });
  });

  describe('StateDefinitionAlterMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateDefinitionAlterMethods<typeof Category>, 1>,
      );
      expect<{ update: 1; publish: 1; delete: 1 }>(
        {} as Record<StateDefinitionAlterMethods<typeof DraftPost>, 1>,
      );
      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateDefinitionAlterMethods<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<StateDefinitionAlterMethods<(typeof Post)[number]>, 1>,
      );
    });
  });

  describe('StateDefinitionAlterWithArgsMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<StateDefinitionAlterWithArgsMethods<typeof Category>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<StateDefinitionAlterWithArgsMethods<typeof DraftPost>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<
          StateDefinitionAlterWithArgsMethods<typeof PublishedPost>,
          1
        >,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<
          StateDefinitionAlterWithArgsMethods<(typeof Post)[number]>,
          1
        >,
      );
    });
  });
  describe('StateDefinitionAlterWithoutArgsMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<
          StateDefinitionAlterWithoutArgsMethods<typeof Category>,
          1
        >,
      );
      expect<{ publish: 1; delete: 1 }>(
        {} as Record<
          StateDefinitionAlterWithoutArgsMethods<typeof DraftPost>,
          1
        >,
      );
      expect<{ delete: 1 }>(
        {} as Record<
          StateDefinitionAlterWithoutArgsMethods<typeof PublishedPost>,
          1
        >,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<
          StateDefinitionAlterWithoutArgsMethods<(typeof Post)[number]>,
          1
        >,
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
        category?: StateId<typeof Category> | null;
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
        category: StateId<typeof Category>;
      }>(
        {} as StateDefinitionMutationArguments<(typeof Post)[number], 'update'>,
      );

      expect<Record<string, never>>(
        {} as StateDefinitionMutationArguments<(typeof Post)[number], 'delete'>,
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
      expect<StateDefinitionMutationsReturn<(typeof Post)[number], 'update'>>(
        DraftPost as (typeof Post)[number],
      );

      expect<StateDefinitionMutationsReturn<(typeof Post)[number], 'delete'>>(
        null as never,
      );
    });
  });
});
