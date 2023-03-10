<p align=center>
  <a href="https://neuledge.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://cdn.neuledge.com/images/logo/dark.svg">
      <img alt="Neuledge" src="https://cdn.neuledge.com/images/logo/light.svg" height="140">
    </picture>
  </a>
</p>

<p align=center>
  <strong>Business rules and data integrity for databases.</strong>
</p>
<p align="center">
  <a href="https://github.com/neuledge/engine-js/actions/workflows/npm.yml" target="_blank">
    <img src="https://github.com/neuledge/engine-js/actions/workflows/npm.yml/badge.svg"
      alt="Build Status">
  </a>
  <a href="https://depfu.com/github/neuledge/engine-js?project_id=37965" target="_blank">
    <img src="https://badges.depfu.com/badges/2c05ca219e802269062aac09ed69994b/overview.svg"
      alt="Dependency Status">
  </a>
  <!-- <a href="https://www.npmjs.org/package/@neuledge/engine" target="_blank">
    <img src="https://img.shields.io/npm/v/@neuledge/engine" alt="View On NPM">
  </a> -->
  <!-- <a href="https://codecov.io/gh/neuledge/engine-js" target="_blank">
    <img src="https://codecov.io/gh/neuledge/engine-js/branch/master/graph/badge.svg?token=4YPG4FPM23"
      alt="Coverage Status" />
  </a> -->
  <a href="https://github.com/neuledge/engine-js/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/github/license/neuledge/engine-js" alt="License">
  </a>
  <a href="https://twitter.com/neuledge" target="_blank">
    <img src="https://img.shields.io/badge/follow-@neuledge-4BBAAB.svg" alt="Follow @neuledge">
  </a>
  <a href="https://discord.gg/49JMwxKvhF" target="_blank">
    <img src="https://img.shields.io/discord/1035085658823327764?logo=discord&logoColor=fff"
      alt="Discord">
  </a>
</p>
<div align="center">
  <a href="https://neuledge.com/docs" target="_blank">Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://discord.gg/49JMwxKvhF" target="_blank">Discord</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.org/package/@neuledge/engine" target="_blank">NPM</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/neuledge/engine-js/issues" target="_blank">Issues</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://twitter.com/neuledge" target="_blank">@neuledge</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://neuledge.com" target="_blank">Website</a>
</div>
<br>

[Neuledge](https://neuledge.com) is an open-source library that simplifies data management and enhances data integrity for databases. It offers a powerful schema language that enables you to define your data models and business logic in a precise and customizable way. The schema language supports scalar types such as `Email(at: 'my-company.com')` and `Integer(min: 1, max: 10)`, providing type-safe data models and ensuring that you always receive the expected data.

With Neuledge, you can create different states for the same entity, each with its own set of fields and mutations. These states are stored and accessed from the same table, with an abstraction layer that defines which fields are needed for each state. For example, you can define a "DraftPost" state with a set of fields and mutations, and then create a "PublishedPost" state that inherits from "DraftPost" and adds more fields and restrictions necessary for published posts.

The Neuledge schema language is identical for relational and non-relational databases, giving you the flexibility to use it with any database of your choice. It allows you to define precise field types, validate data mutations, and enforce business rules across different states. Whether you are working with a small or complex data model, Neuledge makes it easy to manage and maintain your data.

<br>

## ❤️ Sponsored by

If you find Neuledge useful and would like to support its ongoing development and maintenance, please consider [sponsoring us](https://github.com/sponsors/neuledge). Your sponsorship will help us to continue to improve and evolve this project. Thank you for your support!

<br>

## Table of contents

- [Introduction](#-introduction)
- [Features](#-features)
- [Getting started](#-getting-started)
- [Documentation & examples](#-documentation--examples)
- [Join the community](#-join-the-community)
- [License](#-license)

<br>

# 🎉 Introduction

### The problem with traditional data modeling approaches

Developers often face challenges when defining and managing data models. Traditional approaches like using ORM frameworks, writing raw SQL queries, or defining models in application code can introduce overhead, complexity, limitations, and inconsistencies. These methods can also lead to data migrations and schema changes that can cause downtime or data loss. Additionally, as the application grows and the data model becomes more complex, it can be difficult to scale and maintain these approaches.

### How Neuledge solves these problems

Neuledge schema language offers a powerful and flexible solution for defining and managing data models. It allows you to define your data schema and business logic in a precise and customizable way, avoiding data migrations and making it easy to handle complex data models and workflows. With Neuledge schema language, you can define each state of your entities, describe the exact fields and their types that are available in each state, and specify the allowed mutations and data validation rules. This ensures that your data remains consistent and valid over time, while also providing better data integrity and making it easier to work with your data. Neuledge schema is also language and database agnostic, making it highly flexible and adaptable to different environments and use cases.

<br>

# 🚀 Features

- 🛡️ **Precise data modeling:** Define your data schema in a precise and customizable way, with different entities, fields, types, and validation rules for each state.

- 🔄 **Zero data migrations:** Avoid data migrations by allowing the engine to transform the user query and apply it for each state individually.

- 🚦 **Allowed mutations and data validation:** Define the allowed mutations and prevent making invalid changes to the data. Specify rules for creating, updating, and deleting entities, and ensure that your data remains consistent and valid over time.

- 🔍 **Powerful querying:** Query your data with precision and flexibility, using a simple and intuitive syntax. Use a variety of filters, conditions, and aggregations to find the data you need, and make complex queries with ease.

- 🔌 **Database and language agnostic:** Use Neuledge with any programming language or database system, thanks to its language-agnostic design. This makes it highly flexible and adaptable to different environments and use cases.

- 💻 **Easy integration:** Integrate Neuledge with your existing application stack with ease, thanks to its simple and modular architecture. Use it as a standalone server or embed it in your application code, and enjoy seamless communication with other services and components.

- 📚 **Comprehensive documentation:** Learn how to use Neuledge with ease, thanks to its comprehensive and well-organized documentation. Access tutorials, examples, and reference guides, and get up to speed quickly with the language and its features.

- 🌟 **Active community:** Join a vibrant and supportive community of developers and enthusiasts, and share your experiences and insights with others. Contribute to the development of Neuledge, report bugs, and suggest new features and improvements.

<br>

# 🏁 Getting started

## Beta release ⚠️

Neuledge is still in beta release. Help us improve it by [join our community](#-join-the-community) and give us a star ⭐️. If you are interested in using Neuledge in your project, please join our [Discord server](https://discord.gg/49JMwxKvhF) and we will be happy to help you.

<br />

## Installation

Install the Neuledge engine and the MongoDB store:

```bash
npm install @neuledge/engine @neuledge/mongodb-store --save
```

Install a development dependency for the CLI:

```bash
npm install @neuledge/states-cli --save-dev
```

Add `generate:states` script on your `package.json`:

```json
{
  "scripts": {
    "generate:states": "states --output \"src/states.codegen.ts\" \"states/*.states\""
  }
}
```

On the next step, run `npm run generate:states` to generate the states code from your `*.states` files.

This will generate a `src/states.codegen.ts` file with all your business logic code.
You should add this file to your `.gitignore` file, as it will be generated automatically.

<br />

## Define your schema files

Create a `states` folder and your first `.states` files:

#### `states/posts.states`

```states
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
@index(fields: ["category", "title"])
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

#### `states/categories.states`

```states
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

<br />

## Initialize your database

```ts
import { NeuledgeEngine } from '@neuledge/engine';
import { MongoDBStore } from '@neuledge/mongodb-store';

// import your generated code for the engine to use before initializing the engine
import `./states.codegen`;

// use the MongoDBStore to connect to your database
const store = new MongoDBStore({
  url: 'mongodb://localhost:27017',
  name: 'example',
});

// initialize the engine with the store and syncing the database schema
const engine = new NeuledgeEngine({
  store,
});
```

<br />

## Query the database

```ts
import { Category } from './states.codegen';

// create a new category
const category = await engine
  .initOne(Category)
  .create({
    name: 'GraphQL',
  })
  .select();

// update the category
const updatedCategory = await engine
  .alterUniqueOrThrow(Category)
  .update({
    description:
      'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.',
  })
  .unique({ id: category.id })
  .select();

// create new draft post
const draftPost = await engine
  .initOne(DraftPost)
  .create({
    title: 'GraphQL vs REST',
    content:
      'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.',
    category: { id: category.id },
  })
  .select();

// publish the draft post
const publishedPost = await engine
  .alterUniqueOrThrow(DraftPost)
  .publish()
  .unique({ id: draftPost.id })
  .select();

// query published posts by category
const publisedPosts = await engine.findMany(PublishedPost).where({
  category: { id: category.id },
});

// list posts with their categories
const categories = await engine
  .findMany(PublishedPost)
  .expand('category')
  .limit(10);
```

<br>

# 📚 Documentation & examples

For more information, please visit [neuledge.com/docs](https://neuledge.com/docs).

For fully functional code examples, please check the [examples](https://github.com/neuledge/engine-js/tree/main/examples) folder.

<br>

# 🤝 Join the community

To get involved in the Neuledge community:

- Give us a star ⭐️ on GitHub.
- Follow us on [Twitter](https://twitter.com/neuledge).
- Join our [Discord community](https://discord.gg/49JMwxKvhF) to connect with other users and get help.
- Subscribe to our [newsletter](https://neuledge.com/#join) to stay up to date on the latest news and updates.
- If you find any bugs or have any suggestions, please [open an issue](https://github.com/neuledge/engine-js/issues/new/choose) on GitHub or let us know on our [Discord channel](https://discord.gg/49JMwxKvhF).

<br>

# 📜 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
