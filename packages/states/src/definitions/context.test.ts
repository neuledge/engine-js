import { StatesContext } from './context.js';
import { StateDefinition } from './state.js';

/* eslint-disable max-lines-per-function */

describe('defintions/context', () => {
  describe('StatesContext.exec()', () => {
    it('should parse state', async () => {
      const ctx = new StatesContext();

      await ctx.exec(`state Test@1 {
        @id id: Number = 1
      }`);

      expect(ctx.states.Test[0]).toEqual<StateDefinition>({
        name: 'Test',
        version: 1,
        deprecationReason: null,
        description: null,
        fields: {
          id: {
            name: 'id',
            deprecationReason: null,
            description: null,
            index: 1,
            nullable: false,
            primaryKey: true,
            type: {} as never,
          },
        },
      });
    });

    it('should parse state with multiline description', async () => {
      const ctx = new StatesContext();

      await ctx.exec(`
      """
      Test of a comment
      With multiline!
      """
      state Test@1 {
        @id id: Number = 1
      }`);

      expect(ctx.states.Test[0]).toEqual<StateDefinition>({
        name: 'Test',
        version: 1,
        deprecationReason: null,
        description: 'Test of a comment\nWith multiline!',
        fields: {
          id: {
            name: 'id',
            deprecationReason: null,
            description: null,
            index: 1,
            nullable: false,
            primaryKey: true,
            type: {} as never,
          },
        },
      });
    });

    it('should throw on state with deprecated decorator with reason', async () => {
      const ctx = new StatesContext();

      await expect(
        ctx.exec(`
      @deprecated
      state Test@1 {
        @id id: Number = 1
      }`),
      ).rejects.toThrow(
        "'@deprecated' decorator missing a required 'reason' argument (pos: 7)",
      );
    });

    it('should parse state with deprecated reason', async () => {
      const ctx = new StatesContext();

      await ctx.exec(`
      """
      Test of a comment
      With multiline!
      """
      @deprecated(reason: "Foo bar")
      state Test@1 {
        @id id: Number = 1
      }`);

      expect(ctx.states.Test[0]).toEqual<StateDefinition>({
        name: 'Test',
        version: 1,
        deprecationReason: 'Foo bar',
        description: 'Test of a comment\nWith multiline!',
        fields: {
          id: {
            name: 'id',
            deprecationReason: null,
            description: null,
            index: 1,
            nullable: false,
            primaryKey: true,
            type: {} as never,
          },
        },
      });
    });

    it('should parse state with deprecated reason', async () => {
      const ctx = new StatesContext();

      await ctx.exec(`
      state Test@1 {
        "Id of test"
        @id id: Number = 1

        "name of test"
        @deprecated(reason: "foo")
        name: String = 2
      }`);

      expect(ctx.states.Test[0]).toEqual<StateDefinition>({
        name: 'Test',
        version: 1,
        deprecationReason: null,
        description: null,
        fields: {
          id: {
            name: 'id',
            deprecationReason: null,
            description: 'Id of test',
            index: 1,
            nullable: false,
            primaryKey: true,
            type: {} as never,
          },
          name: {
            name: 'name',
            deprecationReason: 'foo',
            description: 'name of test',
            index: 2,
            nullable: false,
            primaryKey: false,
            type: {} as never,
          },
        },
      });
    });

    it('should extends previous state version', async () => {
      const ctx = new StatesContext();

      await ctx.exec(`
      state Test@1 {
        "Id of test"
        @id id: Number = 1

        test?: String = 2
      }

      state Test@2 extends Test@1 {
        -Test@1.test

        name: String = 2
      }`);

      expect(ctx.states.Test).toEqual<StateDefinition[]>([
        {
          name: 'Test',
          version: 1,
          deprecationReason: null,
          description: null,
          fields: {
            id: {
              name: 'id',
              deprecationReason: null,
              description: 'Id of test',
              index: 1,
              nullable: false,
              primaryKey: true,
              type: {} as never,
            },
            test: {
              name: 'test',
              deprecationReason: null,
              description: null,
              index: 2,
              nullable: true,
              primaryKey: false,
              type: {} as never,
            },
          },
        },
        {
          name: 'Test',
          version: 2,
          deprecationReason: null,
          description: null,
          fields: {
            id: {
              name: 'id',
              deprecationReason: null,
              description: 'Id of test',
              index: 1,
              nullable: false,
              primaryKey: true,
              type: {} as never,
            },
            name: {
              name: 'name',
              deprecationReason: null,
              description: null,
              index: 2,
              nullable: false,
              primaryKey: false,
              type: {} as never,
            },
          },
        },
      ]);
    });
  });
});
