# Indexes and keys

Indexes and primary keys are essential for optimizing database queries and ensuring data integrity. In Neuledge, indexes and primary keys are defined using decorators. Let's look at some examples of these decorators in action using some schema examples.

## Primary keys

The `@id` decorator is used to define a primary key for a state. In the "Category" state, we have defined the primary key using the `@id` decorator with an `auto` argument set to "increment". This means that the primary key value will be automatically incremented each time a new record is created.

```states
state Category {
  @id(auto: "increment") id: Integer = 1
  name: String = 2
  description?: String = 3
}
```

Multiple fields can be used as a primary key by defining multiple `@id` decorators or by using a composite key on the state itself. For example, the "Post" state below defines a composite primary key using the "category" and "slug" fields.

```states
@id(fields: { category: 1, slug: 1 })
state Post {
  category: Category = 1
  slug: String = 2
  title: String = 3
  content: String = 4
}
```

## Unique keys

The `@unique` decorator is used to ensure that a field has a unique value across all instances of a state. For example, the "email" field in the "CreatedUser" state is decorated with `@unique`, which ensures that no two users have the same email address. If an attempt is made to create a new "CreatedUser" instance with the same email as an existing user, an error will be thrown.

```states
state CreatedUser {
  @id(auto: "increment") id: Integer = 1
  @unique email: String = 2
}
```

It's important to note that `@unique` should only be used for fields that should be globally unique. Using `@unique` on a field that doesn't need to be unique can lead to unnecessary constraints and potentially degrade performance. Additionally, while `@unique` ensures that no two instances have the same value for a field, it does not guarantee that the field will never be null. If a field that is decorated with `@unique` is nullable and two instances have a null value for that field, they will not violate the uniqueness constraint.

In general, it's a good practice to define a unique index on fields that are used to look up instances uniquely. For example, if you have a state that contains a list of users, you might want to define a `@unique` decorator on the "email" field so that you can look up a spesific user by email address.

Composite unique keys can be defined by using the `@unique` decorator on multiple fields. For example, the "User" state below defines a composite unique key using the "firstName" and "lastName" fields.

```states
@unique(fields: { firstName: 1, lastName: 1 })
state User {
  @id(auto: "increment") id: Integer = 1
  firstName: String = 2
  lastName: String = 3
}
```

## Additional indexes

The `@index` decorator is used to define an index on one or more fields in a state. In the `PublishedPost` state, we have defined an index on the "category" and "title" fields. This allows queries to be optimized when searching for posts based on these fields.

```states
@index(fields: { category: -1, title: 1 })
state PublishedPost from DraftPost {
  ategory: Category = 1
  content: String = 2
  publishedAt: DateTime = 3
}
```

When an index is defined on a single field, you can add an `@index` decorator to the field itself. For example, the "Post" state below defines an index on the "category" field with a descending sort order.

```states
state Post {
  @id(auto: "increment") id: Integer = 1
  @index(sort: -1) category: Category = 1
  title: String = 3
  content: String = 4
}
```

## Indexes and inheritance

It's worth noting that all indexes are defined per state, and the Neuledge engine will optimize and reuse indexes between states when possible. For example, the "PublishedPost" state above defines an index on the "category" and "title" fields. If you have another state that inherits from "PublishedPost" or reuse both the "category" and "title" fields in another state, the engine will reuse the index defined on the "PublishedPost" state.

However, if you inherit from a state that defines an index and you don't want to reuse an index, you can redefine the fields on the child state without an index. For example, the state "ActiveUser" below defines an index on the "email" field. This index will not be reused by the "ArchivedUser" state because the "email" field is redefined without referencing the "email" field from the "ActiveUser" state.

```states
state ActiveUser {
  @id(auto: "increment") id: Integer = 1
  @unique email: Email = 2
}

state ArchivedUser from ActiveUser {
  email: Email = 1
}
```
