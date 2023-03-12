import { State, StatesContext } from '@neuledge/states';
import { generateState } from './index';

/* eslint-disable max-lines-per-function */

describe('generate/state', () => {
  describe('generateState()', () => {
    let users: StatesContext;

    beforeEach(async () => {
      users = new StatesContext();

      await users.exec(`
"User that has been created but not yet activated."
state CreatedUser {
  @id(auto: 'increment') id: Integer = 1
  firstName?: String = 2
  lastName?: String = 3
  @unique email: Email = 4
  @index createdAt: DateTime = 6
}

"User that has been activated."
state ActiveUser from CreatedUser {
  firstName: String = 1
  lastName: String = 2
  passwordHash?: Buffer = 3
  updatedAt: DateTime = 4
}

"User that has been suspended. A suspended user can be activated again."
state SuspendedUser from ActiveUser {
  suspendedAt: DateTime = 1
}

"""
User that has been deleted.
A deleted user cannot be activated again. All personal information is removed.
"""
state DeletedUser from CreatedUser {
  -firstName
  -lastName
  -email

  deletedAt: DateTime = 1
}

"Creates a new user without activating it."
create(
  firstName: String,
  lastName: String,
  email: Email,
): CreatedUser => {
  createdAt: DateTime(),
}

"Activates a created user."
CreatedUser.activate(
  passwordHash?: Buffer,
): ActiveUser => {
  updatedAt: DateTime(),
}

"Creates a new user and activates it immediately."
create(
  firstName: String,
  lastName: String,
  email: Email,
  passwordHash?: Buffer,
): ActiveUser => {
  createdAt: DateTime(),
  updatedAt: DateTime(),
}

"Updates the user's personal information."
ActiveUser.update(
  firstName: String,
  lastName: String,
  email: Email,
  passwordHash?: Buffer,
): ActiveUser => {
  updatedAt: DateTime(),
}

"Suspends an active user."
ActiveUser.suspend(): SuspendedUser => {
  suspendedAt: DateTime(),
}

"Activates a suspended user."
SuspendedUser.activate(): ActiveUser => {
  updatedAt: DateTime(),
}

"A user instance that is able to log in."
either User = ActiveUser | SuspendedUser

"Deletes a user."
User.delete(): DeletedUser => {
  deletedAt: DateTime(),
}

"Deletes a created user without leaving a trace."
CreatedUser.delete(): Void
`);
    });

    it('should generate dummy User state', async () => {
      const ctx = new StatesContext();
      await ctx.exec(`
        state User { 
          @id id: Number = 1
          name: String = 2
          email?: Email = 3
        }
        
        create(name: String, email?: Email): User
        
        User.update(name: String, email?: Email): User => {
          name,
        }
        
        User.delete(): Void
      `);

      expect(generateState(ctx.entity('User') as State)).toMatchInlineSnapshot(`
        "@$.State<'User', User>()
        export class User {
          static $name = 'User' as const;
          static $id = { fields: ['+id'] } as const;
          static $scalars = () => ({
            id: { type: $.scalars.Number, index: 1 },
            name: { type: $.scalars.String, index: 2 },
            email: { type: $.scalars.Email, index: 3, nullable: true },
          });
          static $where: {
            id?: $.WhereNumber<$.scalars.Number> | null;
          };
          static $unique: {
            id: $.scalars.Number;
          };
          static $filter: {
            id?: $.WhereNumber<$.scalars.Number> | null;
            name?: $.WhereString<$.scalars.String> | null;
            email?: $.WhereNullableString<$.scalars.Email> | null;
          };

          id!: $.scalars.Number;
          name!: $.scalars.String;
          email?: $.scalars.Email | null;

          static create = $.mutation<
            typeof User,
            {
              name: $.scalars.String;
              email?: $.scalars.Email | null;
            }
          >('create', async function ({ name, email }) {
            return {
              $state: 'User',
              id: null,
              name,
              email,
            };
          });

          static update = $.mutation<
            typeof User,
            {
              name: $.scalars.String;
              email?: $.scalars.Email | null;
            },
            typeof User
          >('update', async function ({ name, email }) {
            return {
              ...this,
              $state: 'User',
              email,
              name,
            };
          });

          static delete = $.mutation<typeof User>('delete');
        }
        export type $User = $.Entity<typeof User>;"
      `);
    });

    it('should generate users CreatedUser state', async () => {
      expect(generateState(users.entity('CreatedUser') as State))
        .toMatchInlineSnapshot(`
          "/**
           * User that has been created but not yet activated.
           */
          @$.State<'CreatedUser', CreatedUser>()
          export class CreatedUser {
            static $name = 'CreatedUser' as const;
            static $id = { fields: ['+id'], auto: 'increment' } as const;
            static $scalars = () => ({
              id: { type: $.scalars.Integer, index: 1 },
              firstName: { type: $.scalars.String, index: 2, nullable: true },
              lastName: { type: $.scalars.String, index: 3, nullable: true },
              email: { type: $.scalars.Email, index: 4 },
              createdAt: { type: $.scalars.DateTime, index: 6 },
            });
            static $where: 
              | {
                  email?: $.WhereString<$.scalars.Email> | null;
                }
              | {
                  createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
                }
              | {
                  id?: $.WhereNumber<$.scalars.Integer> | null;
                };
            static $unique: {
              email: $.scalars.Email;
            } | {
              id: $.scalars.Integer;
            };
            static $filter: {
              id?: $.WhereNumber<$.scalars.Integer> | null;
              firstName?: $.WhereNullableString<$.scalars.String> | null;
              lastName?: $.WhereNullableString<$.scalars.String> | null;
              email?: $.WhereString<$.scalars.Email> | null;
              createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
            };
            static $indexes = {
              email: { fields: ['+email'], unique: true } as const,
              createdAt: { fields: ['+createdAt'] } as const,
            };
            static $transforms = () => [ActiveUser];

            id!: $.scalars.Integer;
            firstName?: $.scalars.String | null;
            lastName?: $.scalars.String | null;
            email!: $.scalars.Email;
            createdAt!: $.scalars.DateTime;

            /**
             * Creates a new user without activating it.
             */
            static create = $.mutation<
              typeof CreatedUser,
              {
                firstName: $.scalars.String;
                lastName: $.scalars.String;
                email: $.scalars.Email;
              }
            >('create', async function ({ firstName, lastName, email }) {
              return {
                $state: 'CreatedUser',
                id: null,
                firstName,
                lastName,
                email,
                createdAt: await $.runtime.DateTime({}),
              };
            });

            /**
             * Activates a created user.
             */
            static activate = $.mutation<
              typeof CreatedUser,
              {
                passwordHash?: $.scalars.Buffer | null;
              },
              typeof ActiveUser
            >('update', async function ({ passwordHash }) {
              return {
                ...this,
                $state: 'ActiveUser',
                passwordHash,
                updatedAt: await $.runtime.DateTime({}),
              };
            });

            /**
             * Deletes a created user without leaving a trace.
             */
            static delete = $.mutation<typeof CreatedUser>('delete');
          }
          export type $CreatedUser = $.Entity<typeof CreatedUser>;"
        `);
    });

    it('should generate users ActiveUser state', async () => {
      expect(generateState(users.entity('ActiveUser') as State))
        .toMatchInlineSnapshot(`
          "/**
           * User that has been activated.
           */
          @$.State<'ActiveUser', ActiveUser>()
          export class ActiveUser {
            static $name = 'ActiveUser' as const;
            static $id = { fields: ['+id'], auto: 'increment' } as const;
            static $scalars = () => ({
              id: { type: $.scalars.Integer, index: 1 },
              firstName: { type: $.scalars.String, index: 256 },
              lastName: { type: $.scalars.String, index: 257 },
              email: { type: $.scalars.Email, index: 4 },
              createdAt: { type: $.scalars.DateTime, index: 6 },
              passwordHash: { type: $.scalars.Buffer, index: 258, nullable: true },
              updatedAt: { type: $.scalars.DateTime, index: 259 },
            });
            static $where: 
              | {
                  email?: $.WhereString<$.scalars.Email> | null;
                }
              | {
                  createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
                }
              | {
                  id?: $.WhereNumber<$.scalars.Integer> | null;
                };
            static $unique: {
              email: $.scalars.Email;
            } | {
              id: $.scalars.Integer;
            };
            static $filter: {
              id?: $.WhereNumber<$.scalars.Integer> | null;
              firstName?: $.WhereString<$.scalars.String> | null;
              lastName?: $.WhereString<$.scalars.String> | null;
              email?: $.WhereString<$.scalars.Email> | null;
              createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
              passwordHash?: $.WhereNullableBuffer<$.scalars.Buffer> | null;
              updatedAt?: $.WhereDateTime<$.scalars.DateTime> | null;
            };
            static $indexes = {
              email: { fields: ['+email'], unique: true } as const,
              createdAt: { fields: ['+createdAt'] } as const,
            };
            static $transforms = () => [SuspendedUser, DeletedUser];

            id!: $.scalars.Integer;
            firstName!: $.scalars.String;
            lastName!: $.scalars.String;
            email!: $.scalars.Email;
            createdAt!: $.scalars.DateTime;
            passwordHash?: $.scalars.Buffer | null;
            updatedAt!: $.scalars.DateTime;

            /**
             * Creates a new user and activates it immediately.
             */
            static create = $.mutation<
              typeof ActiveUser,
              {
                firstName: $.scalars.String;
                lastName: $.scalars.String;
                email: $.scalars.Email;
                passwordHash?: $.scalars.Buffer | null;
              }
            >('create', async function ({ firstName, lastName, email, passwordHash }) {
              return {
                $state: 'ActiveUser',
                id: null,
                firstName,
                lastName,
                email,
                passwordHash,
                createdAt: await $.runtime.DateTime({}),
                updatedAt: await $.runtime.DateTime({}),
              };
            });

            /**
             * Updates the user's personal information.
             */
            static update = $.mutation<
              typeof ActiveUser,
              {
                firstName: $.scalars.String;
                lastName: $.scalars.String;
                email: $.scalars.Email;
                passwordHash?: $.scalars.Buffer | null;
              },
              typeof ActiveUser
            >('update', async function ({ firstName, lastName, email, passwordHash }) {
              return {
                ...this,
                $state: 'ActiveUser',
                firstName,
                lastName,
                email,
                passwordHash,
                updatedAt: await $.runtime.DateTime({}),
              };
            });

            /**
             * Suspends an active user.
             */
            static suspend = $.mutation<typeof ActiveUser, typeof SuspendedUser>(
              'update',
              async function () {
                return {
                  ...this,
                  $state: 'SuspendedUser',
                  suspendedAt: await $.runtime.DateTime({}),
                };
              },
            );

            /**
             * Deletes a user.
             */
            static delete = $.mutation<typeof ActiveUser, typeof DeletedUser>(
              'update',
              async function () {
                return {
                  ...this,
                  $state: 'DeletedUser',
                  deletedAt: await $.runtime.DateTime({}),
                };
              },
            );
          }
          export type $ActiveUser = $.Entity<typeof ActiveUser>;"
        `);
    });

    it('should generate users SuspendedUser state', async () => {
      expect(generateState(users.entity('SuspendedUser') as State))
        .toMatchInlineSnapshot(`
          "/**
           * User that has been suspended. A suspended user can be activated again.
           */
          @$.State<'SuspendedUser', SuspendedUser>()
          export class SuspendedUser {
            static $name = 'SuspendedUser' as const;
            static $id = { fields: ['+id'], auto: 'increment' } as const;
            static $scalars = () => ({
              id: { type: $.scalars.Integer, index: 1 },
              firstName: { type: $.scalars.String, index: 256 },
              lastName: { type: $.scalars.String, index: 257 },
              email: { type: $.scalars.Email, index: 4 },
              createdAt: { type: $.scalars.DateTime, index: 6 },
              passwordHash: { type: $.scalars.Buffer, index: 258, nullable: true },
              updatedAt: { type: $.scalars.DateTime, index: 259 },
              suspendedAt: { type: $.scalars.DateTime, index: 511 },
            });
            static $where: 
              | {
                  email?: $.WhereString<$.scalars.Email> | null;
                }
              | {
                  createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
                }
              | {
                  id?: $.WhereNumber<$.scalars.Integer> | null;
                };
            static $unique: {
              email: $.scalars.Email;
            } | {
              id: $.scalars.Integer;
            };
            static $filter: {
              id?: $.WhereNumber<$.scalars.Integer> | null;
              firstName?: $.WhereString<$.scalars.String> | null;
              lastName?: $.WhereString<$.scalars.String> | null;
              email?: $.WhereString<$.scalars.Email> | null;
              createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
              passwordHash?: $.WhereNullableBuffer<$.scalars.Buffer> | null;
              updatedAt?: $.WhereDateTime<$.scalars.DateTime> | null;
              suspendedAt?: $.WhereDateTime<$.scalars.DateTime> | null;
            };
            static $indexes = {
              email: { fields: ['+email'], unique: true } as const,
              createdAt: { fields: ['+createdAt'] } as const,
            };
            static $transforms = () => [ActiveUser, DeletedUser];

            id!: $.scalars.Integer;
            firstName!: $.scalars.String;
            lastName!: $.scalars.String;
            email!: $.scalars.Email;
            createdAt!: $.scalars.DateTime;
            passwordHash?: $.scalars.Buffer | null;
            updatedAt!: $.scalars.DateTime;
            suspendedAt!: $.scalars.DateTime;

            /**
             * Activates a suspended user.
             */
            static activate = $.mutation<typeof SuspendedUser, typeof ActiveUser>(
              'update',
              async function () {
                return {
                  ...this,
                  $state: 'ActiveUser',
                  updatedAt: await $.runtime.DateTime({}),
                };
              },
            );

            /**
             * Deletes a user.
             */
            static delete = $.mutation<typeof SuspendedUser, typeof DeletedUser>(
              'update',
              async function () {
                return {
                  ...this,
                  $state: 'DeletedUser',
                  deletedAt: await $.runtime.DateTime({}),
                };
              },
            );
          }
          export type $SuspendedUser = $.Entity<typeof SuspendedUser>;"
        `);
    });

    it('should generate users DeletedUser state', async () => {
      expect(generateState(users.entity('DeletedUser') as State))
        .toMatchInlineSnapshot(`
          "/**
           * User that has been deleted.
           * A deleted user cannot be activated again. All personal information is removed.
           */
          @$.State<'DeletedUser', DeletedUser>()
          export class DeletedUser {
            static $name = 'DeletedUser' as const;
            static $id = { fields: ['+id'], auto: 'increment' } as const;
            static $scalars = () => ({
              id: { type: $.scalars.Integer, index: 1 },
              createdAt: { type: $.scalars.DateTime, index: 6 },
              deletedAt: { type: $.scalars.DateTime, index: 256 },
            });
            static $where: 
              | {
                  createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
                }
              | {
                  id?: $.WhereNumber<$.scalars.Integer> | null;
                };
            static $unique: {
              id: $.scalars.Integer;
            };
            static $filter: {
              id?: $.WhereNumber<$.scalars.Integer> | null;
              createdAt?: $.WhereDateTime<$.scalars.DateTime> | null;
              deletedAt?: $.WhereDateTime<$.scalars.DateTime> | null;
            };
            static $indexes = {
              createdAt: { fields: ['+createdAt'] } as const,
            };

            id!: $.scalars.Integer;
            createdAt!: $.scalars.DateTime;
            deletedAt!: $.scalars.DateTime;
          }
          export type $DeletedUser = $.Entity<typeof DeletedUser>;"
        `);
    });
  });
});
