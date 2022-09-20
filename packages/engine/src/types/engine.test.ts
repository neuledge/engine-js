import {
  FindFirstOptions,
  FindManyOptions,
  FindUniqueOptions,
  MutateManyOptions,
  MutateOneOptions,
  MutateUniqueOptions,
  MutateUniqueProjectOptions,
} from './engine.js';
import { MutationSelect } from './mutations.js';
import { State, StateEntity } from './state.js';

/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable max-lines-per-function */

describe('types/engine', () => {
  class UserName {
    static key = 'UserName' as const;
    static Projection: {
      id?: boolean;
      firstName?: boolean;
      lastName?: boolean;
    };
    static Query: { id?: number };
    static UniqueQuery: { id: number };

    id!: number;
    firstName!: string;
    lastName?: string;

    static toEmail(
      instance: UserName,
      args: {
        email: string;
        password?: string;
      },
    ): StateEntity<typeof UserEmail> {
      return {
        constructor: UserEmail,
        $state: 'UserEmail',
        id: instance.id,
        email: args.email,
        passwordHash: args.password
          ? Buffer.from(`hashed::${args.password}`)
          : undefined,
      };
    }

    static async delete(): Promise<void> {
      // do nothing
    }
  }

  class UserEmail {
    static key = 'UserEmail' as const;
    static Projection: {
      id?: boolean;
      email?: boolean;
      passwordHash?: boolean;
    };
    static Query: { id?: number } | { email?: string };
    static UniqueQuery: { id: number } | { email: string };

    id!: number;
    email!: string;
    passwordHash?: ArrayBuffer;

    static async delete(): Promise<void> {
      // do nothing
    }
  }

  describe('FindUniqueOptions<>', () => {
    const test = <S extends State, P extends S['Projection']>(
      options: FindUniqueOptions<S, P>,
    ) => options;

    it('should find user name', () => {
      const res = test({
        states: [UserName],
        select: { firstName: true },
        where: { id: 123 },
      });

      expect<FindUniqueOptions<typeof UserName, { firstName: true }>>(res);
    });

    it('should not except none exists fields', () => {
      const res = test({
        states: [UserName],
        // @ts-expect-error should error on `email`
        select: { firstName: true, email: true },
        where: { id: 123 },
      });

      expect<FindUniqueOptions<typeof UserName, { firstName: true }>>(res);
    });

    it('should not except none exists fields', () => {
      test({
        states: [UserName],
        // @ts-expect-error should throw on non boolean fields
        select: { firstName: 'true' },
        where: { id: 123 },
      });
    });

    it('should find user name or email', () => {
      const res = test({
        states: [UserName, UserEmail],
        select: { firstName: true },
        where: { id: 123 },
      });

      expect<
        FindUniqueOptions<
          typeof UserName | typeof UserEmail,
          { firstName: true }
        >
      >(res);
    });

    it('should not allow find by email', () => {
      const res = test({
        states: [UserName, UserEmail],
        select: { firstName: true },
        // @ts-expect-error email is not allowed
        where: { email: 'foo@example.com' },
      });

      expect<
        FindUniqueOptions<
          typeof UserName | typeof UserEmail,
          { firstName: true }
        >
      >(res);
    });
  });

  describe('FindManyOptions<>', () => {
    const test = <S extends State, P extends S['Projection']>(
      options: FindManyOptions<S, P>,
    ) => options;

    it('should find user names without where', () => {
      const res = test({
        states: [UserName],
        select: { firstName: true },
        limit: 10,
        offset: '123',
      });

      expect<FindManyOptions<typeof UserName, { firstName: true }>>(res);
    });

    it('should find user names with empty where', () => {
      const res = test({
        states: [UserName],
        select: { firstName: true, id: false },
        where: {},
        limit: 10,
        offset: '123',
      });

      expect<FindManyOptions<typeof UserName, { firstName: true; id: false }>>(
        res,
      );
    });

    it('should find user names with where id', () => {
      const res = test({
        states: [UserName],
        select: { firstName: false },
        where: { id: 123 },
        limit: 10,
        offset: '123',
      });

      expect<FindManyOptions<typeof UserName, { firstName: false }>>(res);
    });

    it('should not allow find only with email', () => {
      const res = test({
        states: [UserName, UserEmail],
        select: { firstName: false },
        // @ts-expect-error expect email is undefined
        where: { email: 'foo@example.com' },
        limit: 10,
        offset: '123',
      });

      expect<
        FindManyOptions<
          typeof UserName | typeof UserEmail,
          { firstName: false }
        >
      >(res);
    });
  });

  describe('FindFirstOptions<>', () => {
    const test = <S extends State, P extends S['Projection']>(
      options: FindFirstOptions<S, P>,
    ) => options;

    it('should allow limit one', () => {
      const res = test({
        states: [UserName],
        select: { firstName: true },
        limit: 1,
        offset: '123',
      });

      expect<FindManyOptions<typeof UserName, { firstName: true }>>(res);
    });

    it('should allow allow limit reverse one', () => {
      const res = test({
        states: [UserName],
        select: { firstName: true },
        limit: -1,
        offset: '123',
      });

      expect<FindManyOptions<typeof UserName, { firstName: true }>>(res);
    });

    it('should not allow limit to be more then one', () => {
      const res = test({
        states: [UserName],
        select: { firstName: true },
        // @ts-expect-error should error on numbers other then 1 and -1
        limit: 2,
        offset: '123',
      });

      expect<FindManyOptions<typeof UserName, { firstName: true }>>(res);
    });
  });

  describe('MutateUniqueOptions<>', () => {
    const test = <S extends State, A extends keyof S>(
      options: MutateUniqueOptions<S, A>,
    ) => options;

    it('should accept action name', () => {
      const res = test({
        states: [UserName],
        action: 'toEmail',
        arguments: { email: 'foo' },
        where: { id: 123 },
      });

      expect<MutateUniqueOptions<typeof UserName, 'toEmail'>>(res);
    });

    it('should not accept action name only on single state', () => {
      test({
        states: [UserName, UserEmail],
        // @ts-expect-error toEmail is not exists on UserEmail
        action: 'toEmail',
        arguments: { email: 'foo' } as never,
        where: { id: 123 },
      });
    });

    it('should accept action name with multiple states', () => {
      const res = test({
        states: [UserName, UserEmail],
        action: 'delete',
        arguments: {},
        where: { id: 123 },
      });

      expect<MutateUniqueOptions<typeof UserName | typeof UserEmail, 'delete'>>(
        res,
      );
    });

    it('should not accept arguments', () => {
      test({
        states: [UserName, UserEmail],
        action: 'delete',
        // @ts-expect-error not equal to empty args
        arguments: { id: true },
        where: { id: 123 },
      });
    });

    it('should error on unknown action name', () => {
      test({
        states: [UserName],
        // @ts-expect-error toEmail2 not found
        action: 'firstName',
        arguments: {} as never,
        where: { id: 123 },
      });
    });

    it('should error on invalid arguments', () => {
      test({
        states: [UserName],
        action: 'toEmail',
        // @ts-expect-error email should be string
        arguments: { email: 123 },
        where: { id: 123 },
      });
    });
  });

  describe('MutateUniqueProjectOptions<>', () => {
    const test = <
      S extends State,
      A extends keyof S,
      P extends MutationSelect<S, A>,
    >(
      options: MutateUniqueProjectOptions<S, A, P>,
    ) => options;

    it('should select target state fields', () => {
      const res = test({
        states: [UserName],
        action: 'toEmail',
        arguments: { email: 'foo' },
        where: { id: 123 },
        select: { email: true },
      });

      expect<
        MutateUniqueProjectOptions<typeof UserName, 'toEmail', { email: true }>
      >(res);
    });

    it('should not select current state fields', () => {
      test({
        states: [UserName],
        action: 'toEmail',
        arguments: { email: 'foo' },
        where: { id: 123 },
        // @ts-expect-error firstName is not exist on UserEmail
        select: { firstName: true },
      });
    });

    it('should not select fields of null state', () => {
      test({
        states: [UserName],
        // @ts-expect-error cant select on delete
        action: 'delete',
        arguments: {},
        where: { id: 123 },
        select: { firstName: true },
      });
    });
  });

  describe('MutateManyOptions<>', () => {
    const test = <S extends State, A extends keyof S>(
      options: MutateManyOptions<S, A>,
    ) => options;

    it('should accept select options', () => {
      const res = test({
        states: [UserName],
        action: 'toEmail',
        arguments: { email: 'foo' },
        where: { id: 123 },
      });

      expect<MutateManyOptions<typeof UserName, 'toEmail'>>(res);
    });
  });

  describe('MutateOneOptions<>', () => {
    const test = <S extends State, A extends keyof S>(
      options: MutateOneOptions<S, A>,
    ) => options;

    it('should accept select options', () => {
      const res = test({
        states: [UserName],
        action: 'toEmail',
        arguments: { email: 'foo' },
        where: { id: 123 },
      });

      expect<MutateOneOptions<typeof UserName, 'toEmail'>>(res);
    });

    it('should accept limit 1', () => {
      const res = test({
        states: [UserName],
        action: 'toEmail',
        arguments: { email: 'foo' },
        where: { id: 123 },
        limit: 1,
      });

      expect<MutateOneOptions<typeof UserName, 'toEmail'>>(res);
    });

    it('should not accept limit  select options', () => {
      test({
        states: [UserName],
        action: 'toEmail',
        arguments: { email: 'foo' },
        where: { id: 123 },
        // @ts-expect-error limit should be only 1
        limit: -1,
      });
    });
  });
});
