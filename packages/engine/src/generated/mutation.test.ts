import {
  StateActionArguments,
  StateActionReturn,
  StateActions,
  StateCreateActions,
  StateDeleteActions,
  StateTransformActions,
  StateUpdateActions,
} from './mutation.js';
import {
  Category,
  DraftPost,
  Post,
  PublishedPost,
} from './__test__/category-post-example.js';

/* eslint-disable max-lines-per-function */

describe('generated/mutation', () => {
  describe('StateActions<>', () => {
    it('should have single state actions', () => {
      expect<{ create: 1; update: 1; delete: 1 }>(
        {} as Record<StateActions<typeof Category>, 1>,
      );

      expect<{ create: 1; update: 1; publish: 1; delete: 1 }>(
        {} as Record<StateActions<typeof DraftPost>, 1>,
      );

      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateActions<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state actions', () => {
      expect<{ update: 1; delete: 1 }>(
        {} as Record<StateActions<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateCreateActions<>', () => {
    it('should have single state actions', () => {
      expect<{ create: 1 }>(
        {} as Record<StateCreateActions<typeof Category>, 1>,
      );
      expect<{ create: 1 }>(
        {} as Record<StateCreateActions<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateCreateActions<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state actions', () => {
      expect<Record<never, 1>>(
        {} as Record<StateCreateActions<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateUpdateActions<>', () => {
    it('should have single state actions', () => {
      expect<{ update: 1 }>(
        {} as Record<StateUpdateActions<typeof Category>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<StateUpdateActions<typeof DraftPost>, 1>,
      );
      expect<{ update: 1 }>(
        {} as Record<StateUpdateActions<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state actions', () => {
      expect<{ update: 1 }>(
        {} as Record<StateUpdateActions<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateTransformActions<>', () => {
    it('should have single state actions', () => {
      expect<Record<never, 1>>(
        {} as Record<StateTransformActions<typeof Category>, 1>,
      );
      expect<{ publish: 1 }>(
        {} as Record<StateTransformActions<typeof DraftPost>, 1>,
      );
      expect<Record<never, 1>>(
        {} as Record<StateTransformActions<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state actions', () => {
      expect<Record<never, 1>>(
        {} as Record<StateTransformActions<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateDeleteActions<>', () => {
    it('should have single state actions', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteActions<typeof Category>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteActions<typeof DraftPost>, 1>,
      );
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteActions<typeof PublishedPost>, 1>,
      );
    });

    it('should have multiple state actions', () => {
      expect<{ delete: 1 }>(
        {} as Record<StateDeleteActions<typeof Post[number]>, 1>,
      );
    });
  });

  describe('StateActionArguments<>', () => {
    it('should have single state action arguments', () => {
      expect<{
        name: string;
        description?: string | null;
      }>({} as StateActionArguments<typeof Category, 'create'>);

      expect<{
        title: string;
        content?: string | null;
        category: typeof Category['$id'];
      }>({} as StateActionArguments<typeof DraftPost, 'update'>);

      expect<Record<string, never>>(
        {} as StateActionArguments<typeof DraftPost, 'publish'>,
      );

      expect<Record<string, never>>(
        {} as StateActionArguments<typeof PublishedPost, 'delete'>,
      );
    });

    it('should have multiple states action arguments', () => {
      expect<{
        title: string;
        content: string;
        category: typeof Category['$id'];
      }>({} as StateActionArguments<typeof Post[number], 'update'>);

      expect<Record<string, never>>(
        {} as StateActionArguments<typeof Post[number], 'delete'>,
      );
    });
  });

  describe('StateActionReturn<>', () => {
    it('should have single state action return', () => {
      expect<typeof Category>(
        {} as StateActionReturn<typeof Category, 'create'>,
      );

      expect<typeof DraftPost>(
        {} as StateActionReturn<typeof DraftPost, 'update'>,
      );

      expect<typeof PublishedPost>(
        {} as StateActionReturn<typeof DraftPost, 'publish'>,
      );

      expect<StateActionReturn<typeof PublishedPost, 'delete'>>(null);
    });

    it('should have multiple states action return', () => {
      expect<StateActionReturn<typeof Post[number], 'update'>>(DraftPost);
      expect<StateActionReturn<typeof Post[number], 'update'>>(PublishedPost);
      expect<StateActionReturn<typeof Post[number], 'delete'>>(null);
    });
  });
});
