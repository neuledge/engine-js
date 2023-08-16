# Either states

In the previous section, we learned about state inheritance and how it allows us to define a hierarchy of related states. However, sometimes it's useful to define states that are not related in a hierarchical way. This is where the `either` keyword comes in.

The `either` keyword allows us to define an either state, which is a union of two or more states that are not related in a hierarchical way. An either state can be used to represent multiple states that share some common properties or behaviors, but cannot be expressed using inheritance.

## Syntax

The syntax for an either state is as follows:

```states
either User = RegisteredUser | ActiveUser
```

In this example, we define an either state called User that can be either a "RegisteredUser" or an "ActiveUser". The `|` symbol is used to separate the different states that make up the either state.

## Motivation and use cases

### Relationship between states

One use case for an either state is to define a relation between entities. For example, if we have an entity called "Order" and we want to associate it with a "User", we can define the "User" state as an either state that includes both "RegisteredUser" and "ActiveUser" states. Then, we can define a field on the "Order" entity that references a "User", and the field can be of type "User".

```states
state Order {
  user: User = 1
}
```

### Common properties and mutations

Another use case for an either state is to define mutations that apply to multiple states. For example, if we want to define a mutation that allows a user to update their personal information, we can define the mutation on top of "User" directly. This will allow the mutation to be used with both "RegisteredUser" and "ActiveUser" states without having to define the mutation twice.

```states
User.updatePersonalInfo(
  firstName: String,
  lastName: String,
): User
```

Please note that you can only use an either state as a return type for a mutation if the same either state is used as the input type for the mutation. For example, the following mutation is not valid because the input type is "RegisteredUser" and the return type is "User".

```states
RegisteredUser.updatePersonalInfo(
  firstName: String,
  lastName: String,
): User
```

However, the opposite is valid because the input type is "User" and the return type is "RegisteredUser".

```states
User.updatePersonalInfo(
  firstName: String,
  lastName: String,
): RegisteredUser
```

In the upcoming section, we'll explore how to use mutations in more detail.
