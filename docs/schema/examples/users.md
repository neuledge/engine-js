# Users schema example

This example shows how to model a user registration system with states.

```states filename="users.state"
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
  firstName: String,
  lastName: String,
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
```
