# Writing your states files

The `*.states` files are written in Neuledge schema language. The states files are tipically located in the `states` directory of your project, but you can put them anywhere you want. If you seperate your code into multiple modules, you can keep each module's states on it's own directory.

## Adding a new state

To add a new state, you need to create a new file with the `.states` extension, for example `categories.states`:

```states filename="categories.states"
"""
This is the category state.
"""
state Category {
  "The category id"
  id: Integer = 1

  "The category name"
  name: String = 2
}
```

The `state` keyword is used to define a new state. The name of the state is `Category` and it has two fields: `id` and `name`. The `id` field is a `Integer` and the `name` field is a `String`. The `= 1` and `= 2` are the field's indexes. The indexes are used to identify the fields in the state. Both the field names and indexes must be unique within the state.

## Adding a primary key

To add a primary key to a state, you need to add the `@id` decorator to the field definition:

```states filename="categories.states" /@id(auto: "increment")/
state Category {
  "The category id"
  @id(auto: "increment") id: Integer = 1

  "The category name"
  name: String = 2
}
```

The `@id` decorator takes an optional `auto` argument. The `auto` argument can be set to `"increment"` to automatically increment the id when a new state is created. If the `auto` argument is not set, the id must be set manually when creating a new state.

## Optional fields

To make a field optional, you need to add the `?` character after the field type:

```states filename="categories.states"
state Category {
  # ...

  "The category description"
  description?: String = 3
}
```

## Add additional states

In the example above, we only defined a single state. You can define as many states as you want in a single file. For example, we can create the `posts.states` file with the following states:

```states filename="posts.states"
state DraftPost {
  @id(auto: "increment") id: Integer = 1
  category?: Category = 2
  title: String = 3
  content?: String = 4
}

@index(fields: ["category"])
state PublishedPost from DraftPost {
  category: Category = 1
  content: String = 2
  publishedAt: DateTime = 3
}
```

The `PublishedPost` state extends the `DraftPost` state and adds the `publishedAt` field. It also override the `category` and `content` fields to make them required. Neuledge will automatically detect and store both post's states in the same table, and will reuse the same indexes whenever possible.

The `@index` decorator is used to create an index on the `category` field. Note that the field `category` has the same type as the state we defined in the `categories.states` file. This will automatically creates a foreign key relationship between the `category` field and the `id` field of the `Category` state.

## Aliasing multiple states

In order to keep track of all the possible post states, we can create an `either` type that will alias all the possible post states:

```states filename="posts.states"
either Post = DraftPost | PublishedPost
```

The `either` keyword is used to create a new type that can be used to alias multiple states. The `Post` type can be used to reference any of the `DraftPost` or `PublishedPost` states.

## Add relation fields

Notice that our posts states have a `category` field that references the `Category` state. We can add a `posts` field to the `Category` state to create a relation between the two states:

```states filename="categories.states"
state Category {
  # ...

  @reference(field: 'category') posts: Post[] = 4
}
```

The `@reference` decorator is used to create a relation between the `Category` state and the `Post` state. The `field` argument is used to specify the field name of the `Post` state that references the `Category` state.

## Add composite indexes

Composite indexes are used to create indexes on multiple fields. For example, we can create a composite index on the `category` and `title` fields of the `PublishedPost` state:

```states filename="posts.states"
@index(fields: { category: -1, title: 1 })
state PublishedPost from DraftPost {
  # ...
}
```

The `@index` decorator takes a `fields` argument. The `fields` argument can be set to an array of field names, or to an object to create a composite index. The object keys are the field names and the object values are the sort order of the field. The sort order can be set to `1` for ascending order, or `-1` for descending order.
