<p align=center>
  <a href="https://neuledge.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://cdn.neuledge.com/images/logo/dark.svg">
      <img alt="Neuledge" src="https://cdn.neuledge.com/images/logo/light.svg" height="140">
    </picture>
  </a>
</p>

<p align=center>
  <strong>Predictable data schema and business logic definitions for databases.</strong>
</p>
<p align="center">
  <a href="https://www.npmjs.org/package/@neuledge/engine">
    <img src="https://img.shields.io/npm/v/@neuledge/engine" alt="View On NPM">
  </a>
  <a href="https://github.com/neuledge/engine-js/actions/workflows/npm.yml">
    <img src="https://github.com/neuledge/engine-js/actions/workflows/npm.yml/badge.svg"
      alt="Build Status">
  </a>
  <a href="https://depfu.com/github/neuledge/engine-js?project_id=37965">
    <img src="https://badges.depfu.com/badges/2c05ca219e802269062aac09ed69994b/overview.svg"
      alt="Dependency Status">
  </a>
  <!-- <a href="https://codecov.io/gh/neuledge/engine-js">
    <img src="https://codecov.io/gh/neuledge/engine-js/branch/master/graph/badge.svg?token=4YPG4FPM23"
      alt="Coverage Status" />
  </a> -->
  <a href="https://github.com/neuledge/engine-js/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/neuledge/engine-js" alt="License">
  </a>
</p>
<br>

[Neuledge](https://neuledge.com) is an ORM and a schema language that improves data integrity and simplifies business logic interfaces. Neuledge schema language helps enforcing business rules and consistent data usage across the application and database.

### Main features

- **Human-readable schema language**
- **Type-safe data models**
- **Consistent data usage**
- **Business rules enforcement**
- **Identical for rational and non-relational databases**

## ❤️ Sponsored by

If you find Neuledge useful and would like to support its ongoing development and maintenance, please consider [sponsoring us](https://github.com/sponsors/neuledge). Your sponsorship will help us to continue to improve and evolve this project. Thank you for your support!

<br>

# Table of contents

- [Beta release](#-beta-release)
- [How it works](#-how-it-works)
- [Getting started](#-getting-started)
- [Documentation & examples](#-documentation--examples)
- [Join the community](#-join-the-community)
- [License](#-license)

<br>

# 🏁 Beta release

Neuledge is now in beta release! If you are interested in using Neuledge in your project, help us improve it by [join our community](#-join-the-community) and give us a star ⭐️.

For more information, please visit [neuledge.com](https://neuledge.com).

<br>

# 🤔 How it works

Neuledge is a schema language that allows you to define your data models and business logic in a human-readable format. It's based on a state machine that helps you enforce business rules and consistent data usage across the application and database.

With Neuledge, you can create different states for the same entity. Each state can have its own fields and mutations, allowing you to define and enforce different business rules for each state. For example, you can define a "DraftPost" state with a set of fields and mutations and then create a "PublishedPost" state that inherits from "DraftPost" and adds more fields and restrictions nessesary for published posts.

```states
state DraftPost {
  @id id: Integer = 1
  title: String = 2
  content?: String = 3
  category?: Category = 4
}

state PublishedPost from DraftPost {
  content: String = 1
  category: Category = 2
  publishedAt: DateTime = 3
}
```

On your database, Neuledge will create a single collection "posts" and will store both "DraftPost" and "PublishedPost" states in it. You can query and mutate both states using the same collection, but you can also query and mutate only "DraftPost" or "PublishedPost" states separately.

This makes it easy to work with different states on type-safe interfaces, ensuring that you always get the data you expect. For instance, you can define a "publish" mutation that will only be available on "DraftPost" states, and it will require the "content" and "category" fields to be defined. This way, you can ensure that all published posts have the required data, and prevent any errors or inconsistencies in your database.

```states
DraftPost.publish(): PublishedPost => {
  content: Required(value: this.content),
  category: Required(value: this.category),
  publishedAt: DateTime(),
}
```

<br>

# 🚀 Getting started

### Install

```bash
npm install @neuledge/engine @neuledge/mongodb-store
```

### Define your schema

Create a `states` folder and your first `category.state` file:

```states
"""
A posts category
"""
state Category {
  @id(auto: "increment") id: Integer = 1
  name: String = 2
  description?: String = 3
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

### Generate your code

Install a development dependency:

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

Run the script:

```bash
npm run generate:states
```

This will generate a `src/states.codegen.ts` file with all your business logic code.
You should add this file to your `.gitignore` file, as it will be generated automatically.

### Initialize your database

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

### Use your code

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

// query categories
const categories = await engine.findMany(Category);

// delete the category
await engine.alterUniqueOrThrow(Category).delete().unique({ id: category.id });
```

<br>

# 📚 Documentation & examples

For more information, please visit [neuledge.com/docs](https://neuledge.com/docs).

For examples, please check the [examples](https://github.com/neuledge/engine-js/tree/main/examples) folder.

<br>

# 🤝 Join the community

To get involved in the Neuledge community:

- Give us a star ⭐️ on GitHub.
- Follow us on [Twitter](https://twitter.com/neuledge).
- Join our [Discord community](https://discord.gg/49JMwxKvhF) to connect with other users and get help.
- Subscribe to our [newsletter](https://neuledge.com/#join) to stay up to date on the latest news and updates.
- If you find any bugs or have any suggestions, please [open an issue](https://github.com/neuledge/engine-js/issues/new/choose) on GitHub or let us know on our [Discord channel](https://discord.gg/49JMwxKvhF).

<br>

# 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
