import { Callout } from 'nextra-theme-docs';

# Mutations

In Neuledge, a mutation is an operation that modifies data in the system. Mutations allow you to create, update, or delete data, among other operations. The main benefit of mutation definition is to strictly define the data that can be modified in the system. This is especially useful when you have multiple teams or clients that need to modify data in the system. By defining mutations, you can ensure that the data is always in a valid state.

In this section, we'll explore the syntax for mutations and provide examples of how to use them.

## Syntax

Mutations are defined using a syntax similar to function calls. Each mutation has a name and a set of input arguments. Mutations can also return values, which are specified using the => arrow syntax. Here's an example of a mutation that creates a new user and activates it immediately:

```states
create(
  firstName: String,
  lastName: String,
  email: Email,
  passwordHash?: Buffer,
): ActiveUser => {
  createdAt: DateTime(),
  updatedAt: DateTime(),
}
```

In this example, the create mutation takes four input arguments. The last argument "passwordHash" is optional, as indicated by the `?` symbol. The order of the arguments does not matter, and the user will be able to specify them in any order when calling the mutation.

The mutation returns a value of type ActiveUser. The return value is an object that contains the values of the input arguments, as well as the values of the fields that are specified in the return value. In this example, the return value contains the values of the input arguments, as well as the values of the "createdAt" and "updatedAt" fields, which are set to the current date and time.

## Optional return values

If you don't need to return a value from a mutation, you can omit the return type. For example, the "update" mutation bellow updates the user's first name and last name. Since the return value is the same as the input arguments, we can omit the return body.

```states
User.update(
  firstName: String,
  lastName: String,
): User
```

## Changing the entity state

The main purpose of mutations is to change the state of an entity. To do this, you need to specify the entity that the mutation will modify. This is done by specifying the entity name in the mutation name. For example, the "activate" mutation bellow modifies the state of the RegisteredUser entity.

```states
RegisteredUser.activate(
  email: Email,
  passwordHash: Buffer,
): ActiveUser => {
  updatedAt: DateTime(),
}
```

Notice that this mutation can only be called on entities with state "RegisteredUser". If you try to call it on an entity of a different type, the compiler will report an error. If you need have the same mutation for multiple entity states, you can use the [either states](either) to specify multiple entity states at once.

## Overriding an existing mutation

When using the `either` states, it's possible to define the same mutation name both for the either state as well as for one of the states that it contains. In this case, calling the mutation on the explict state will override the mutation defined for the either state. For example, the "activate" mutation bellow overrides the "activate" mutation defined for the "either" state.

```states
either User = RegisteredUser | ActiveUser

User.activate(
  email: Email,
  passwordHash: Buffer,
): User => {
  updatedAt: DateTime(),
}

ActiveUser.activate(): ActiveUser => {
  updatedAt: DateTime(),
  activatedAt: DateTime(),
}
```

## Deleting an entity

To delete an entity, you can use the `Void` state as a return type for the mutation. For example, the "delete" mutation bellow deletes the entity that it is called on.

```states
User.delete(): Void
```

<Callout type="info" emoji="💡">
  If a void mutation has a return value, the return value will be ignored. In
  the future, we plan to use that for more sofisicated validations that can
  perform additional checks before deleting the entity.
</Callout>
