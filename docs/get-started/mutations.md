# Define state mutations

Mutations are the only way to change the state of the store. Mutations are defined among your states in the `*.states` files. They are defined as functions that take the current state as the `this` argument and the payload as the first argument. The payload can be anything, but it is usually an object with the new values for the state.

Let’s define a mutation to update a post in our blog:

```states filename="posts.states"
"""
Update a post
"""
Post.update(title: String, content: String): Post => {
  title: title,
  content: content,
}
```

The `Post.update` mutation takes two arguments, `title` and `content`, and returns an updated `Post` state with the new values for the `title` and `content` properties. It's also possible to use a shorthand syntax for mutations that only overrite properties:

```states filename="counter.states"
"""
Update a post
"""
Post.update(title: String, content: String): Post
```

## Transitioning between states

The `Post.update` mutation didn't change the type of the state and therefore didn't trigger a transition. To transition between states, let's define a new mutation that will publish a draft post:

```states filename="posts.states"
"""
Publish a draft post
"""
DraftPost.publish(): PublishedPost => {
  content: Required(value: this.content),
  category: Required(value: this.category),
  publishedAt: DateTime(),
}
```

The `DraftPost.publish` mutation returns a `PublishedPost` state. The `Required` type is a special type that makes sure that the value is not `null` or `undefined`. The `DateTime` type will automatically set the value to the current date and time.

## Creating new entities

To create a new entity, we need to define a mutation that returns the new entity. Let's define a mutation to create a new post:

```states filename="posts.states"
"""
Create a new draft post
"""
create(
  title: String
  content?: String
  category?: Category
): DraftPost
```

Notice that the `create` mutation doesn't take any `this` arguments. This is because it doesn't update an existing state, but creates a new one.

## Deleting entities

To delete an entity, we need to define a mutation that returns `Void`. Let's define a mutation to delete a post:

```states filename="posts.states"
"""
Delete a post
"""
Post.delete(): Void
```

Delete mutation don't take any arguments, because they don't need to, but it's possible to pass arguments to delete mutations as well and use them to run some validation logic before deleting the entity.
