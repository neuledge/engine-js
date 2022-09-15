import { Scalar } from '@neuledge/scalar';
import { State } from '@neuledge/state';
import { Entity, isState } from './index.js';

/* eslint-disable max-lines-per-function */

describe('Entity', () => {
  // test types

  type CreatedUser = State<
    'CreatedUser',
    {
      id: { index: 1; type: Scalar<string, Buffer | string>; primaryKey: true };
      username: { index: 2; type: Scalar<string> };
      firstName: { index: 3; type: Scalar<string> };
      lastName: { index: 4; type: Scalar<string> };
      email: { index: 5; type: Scalar<string> };
      normlizedEmail: { index: 6; type: Scalar<string> };
      passwordHash: {
        index: 7;
        type: Scalar<Buffer, { id: string; email: string; password: string }>;
        nullable: true;
      };
      manager: { index: 8; type: User[]; nullable: true };
    }
  >;

  type SuspendedUser = State<
    'SuspendedUser',
    {
      id: { index: 1; type: Scalar<string, Buffer | string>; id: true };
      username: { index: 2; type: Scalar<string>; nullable: true };
      firstName: { index: 3; type: Scalar<string> };
      lastName: { index: 4; type: Scalar<string> };
      email: { index: 5; type: Scalar<string> };
      normlizedEmail: { index: 6; type: Scalar<string> };
      passwordHash: {
        index: 7;
        type: Scalar<Buffer, { id: string; email: string; password: string }>;
        nullable: true;
      };
      suspendedAt: { index: 9; type: Scalar<Date, Date | string | number> };
    }
  >;

  type DeletedUser = State<
    'DeletedUser',
    {
      id: { index: 1; type: Scalar<string, Buffer | string>; id: true };
    }
  >;

  type User = CreatedUser | SuspendedUser | DeletedUser;

  // tests

  describe('Entity<>', () => {
    it('should populate user correctly with all states', () => {
      type user = Entity<
        User,
        { id: 1; username: true; passwordHash: 1; suspendedAt: 1 }
      >;

      expect<{
        $state: 'CreatedUser' | 'SuspendedUser' | 'DeletedUser';
        id: string;
        username?: string;
        passwordHash?: Buffer;
      }>({} as user);

      expect<user>({
        $state: 'CreatedUser',
        id: 'id',
        username: 'demo',
      });

      expect<user>({
        $state: 'SuspendedUser',
        id: 'id',
        username: undefined,
        suspendedAt: new Date(),
      });

      expect<user>({
        $state: 'DeletedUser',
        id: 'id',
      });
    });
  });

  // TODO add more type tests

  describe('isStateName()', () => {
    const demo: Entity<User, { id: 1; username: true; passwordHash: 1 }> = {
      $state: 'CreatedUser',
      id: '123',
      username: 'demo',
    };

    const old: Entity<User, { id: 1; suspendedAt: 1 }> = {
      ...demo,
      $state: 'SuspendedUser',
      suspendedAt: new Date(0),
    };

    it('filter by state name', () => {
      expect<typeof demo[]>([demo, old].filter(isState('CreatedUser'))).toEqual(
        [demo],
      );
      expect<typeof old[]>(
        [demo, old].filter(isState('SuspendedUser')),
      ).toEqual([old]);

      const empty = [demo, old].filter(isState('Foo'));
      expect<never[]>(empty).toEqual([]);
    });
  });
});
