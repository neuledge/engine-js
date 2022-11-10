import {
  StateMutationArguments,
  StateMutations,
  StateCreateMutations,
  StateDeleteMutations,
  StateUpdateWithoutArgsMutations,
  StateUpdateWithArgsMutations,
  StateMutationsReturn,
} from './mutation.js';
import { StateId } from './state/index.js';
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
        {} as Record<StateMutations<typeof Category>, 1>,
      );

      expect<{ create: 1; update: 1; publish: 1; delete: 1 }>(
        {} as Record<StateMutations<typeof DraftPost>, 1>,
      );

      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateCreateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ create: 1 }>(
        {} as Record<StateCreateMutations<typeof Category>, 1>,
      );
      expect<{ create: 1 }>(
        {} as Record<StateCreateMutations<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateCreateMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateCreateMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateUpdateMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<StateUpdateWithArgsMutations<typeof Category>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<StateUpdateWithArgsMutations<typeof DraftPost>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<StateUpdateWithArgsMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ update: 1 }>(
        {} as Record<StateUpdateWithArgsMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateTransformMethods<>', () => {
    it('should have single state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateUpdateWithoutArgsMutations<typeof Category>, 1>,
      );
      expect<{ publish: 1 }>(
        {} as Record<StateUpdateWithoutArgsMutations<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateUpdateWithoutArgsMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<Record<never, 1>>(
        {} as Record<StateUpdateWithoutArgsMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateDeleteMethods<>', () => {
    it('should have single state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMutations<typeof Category>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMutations<typeof DraftPost>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMutations<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state methods', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteMutations<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateMethodArguments<>', () => {
    it('should have single state method arguments', () => {
      expect<{
        name: string;
        description?: string | null;
      }>({} as StateMutationArguments<typeof Category, 'create'>);

      expect<{
        title: string;
        content?: string | null;
        category?: StateId<typeof Category> | null;
      }>({} as StateMutationArguments<typeof DraftPost, 'update'>);

      expect<Record<string, never>>(
        {} as StateMutationArguments<typeof DraftPost, 'publish'>,
      );

      expect<Record<string, never>>(
        {} as StateMutationArguments<typeof PublishedPost, 'delete'>,
      );
    });

    it('should have multiple states method arguments', () => {
      expect<{
        title: string;
        content: string;
        category: StateId<typeof Category>;
      }>({} as StateMutationArguments<typeof Post[number], 'update'>);

      expect<Record<string, never>>(
        {} as StateMutationArguments<typeof Post[number], 'delete'>,
      );
    });
  });

  describe('StateMethodReturn<>', () => {
    it('should have single state method return', () => {
      expect<typeof Category>(
        {} as StateMutationsReturn<typeof Category, 'create'>,
      );

      expect<typeof DraftPost>(
        {} as StateMutationsReturn<typeof DraftPost, 'update'>,
      );

      expect<typeof PublishedPost>(
        {} as StateMutationsReturn<typeof DraftPost, 'publish'>,
      );

      expect<never>({} as StateMutationsReturn<typeof PublishedPost, 'delete'>);
    });

    it('should have multiple states method return', () => {
      expect<typeof DraftPost | typeof PublishedPost>(
        {} as StateMutationsReturn<typeof Post[number], 'update'>,
      );

      expect<never>({} as StateMutationsReturn<typeof Post[number], 'delete'>);
    });
  });
});
