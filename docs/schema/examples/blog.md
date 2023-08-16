# Blog schema example

This example shows a schema for a blog. Our blog contains categories and posts, where posts can be on draft mode or published.

## Category states

```states filename="categories.states"
"""
A posts category
"""
state Category {
  @id(auto: "increment") id: Integer = 1
  name: String = 2
  description?: String = 3
  @reference(field: 'category') posts: Post[] = 4
}

"""
Create a new category
"""
create(
  name: String
  description?: String
): Category

"""
Update the category details
"""
Category.update(
  name: String
  description?: String
): Category

"""
Delete the category and all it's related posts
"""
Category.delete(): Void
```

## Post states

```states filename="posts.states"
either Post = DraftPost | PublishedPost

"""
An unpublished post
"""
state DraftPost {
  @id(auto: "increment") id: Integer = 1
  category?: Category = 2
  title: String = 3
  content?: String = 4
}

"""
A published post
"""
@index(fields: { category: -1, title: 1 })
state PublishedPost from DraftPost {
  category: Category = 1
  content: String = 2
  publishedAt: DateTime = 3
}

"""
Create a new draft post
"""
create(
  title: String
  content?: String
  category?: Category
): DraftPost

"""
Update a draft post
"""
DraftPost.update(
  title: String
  content?: String
  category?: Category
): DraftPost

"""
Update a post
"""
Post.update(
  title: String
  content: String
  category: Category
): Post

"""
Publish a draft post
"""
DraftPost.publish(): PublishedPost => {
  content: Required(value: this.content),
  category: Required(value: this.category),
  publishedAt: DateTime(),
}

"""
Delete a post
"""
Post.delete(): Void
```
