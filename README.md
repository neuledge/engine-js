# Neuledge JavaScript Engine

JavaScript implementation of Neuledge state-machine engine.

Define business-logic states and compile them to a type-safe state-machine ORM:

```
state DraftPost {
  @id id: PositiveInteger = 1
  title: String? = 2
  content: String? = 3
}

state PublishedPost from DraftPost {
  DraftPost.id
  author: ActiveUser
  title: String = 2
  content: String = 3
  viewsCount: Number = 4

  @index(type: "full-text", fields: [title, content])
}

DraftPost.publish(publisher: ActiveUser): PublishedPost => {
  ...this,
  author: publisher,
  publishedAt: Date(),
}
```
