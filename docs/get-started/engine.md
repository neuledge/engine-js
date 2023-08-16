# Using the engine

Before you can use the engine, you need to create a new instance of it. This is done by calling the `NeuledgeEngine` constructor:

```ts filename="src/engine.ts"
import { NeuledgeEngine } from '@neuledge/engine';
import { store } from './store';

export const engine = new NeuledgeEngine({
  store,
});
```

The engine will automatically connects to the store and will be ready to use. Any state that will be used by the engine will be automatically registered on the store. New collections and tables will be created if they don't exist.

Make sure you run `npm run build` and generate the states generated code before you start the engine.

## Creating a new entity

To create a new entity, you need to calling `initOne` or `initMany` methods on the engine with the required initial state ot create. Only states with create mutations will be available to initialize:

```ts
import { DraftPost } from './states.codegen';

const category = await engine
  .initOne(DraftPost)
  .create({
    title: 'My draft post'
    content: 'This is a draft post',
  })
  .select();
```

The mutation will save the entity on the store and return the newly created entity.

## Mutate an existing entity

Entity mutations are done by calling the `alter*` methods on the engine. You're required to pass the states you want to alter and the mutation you want to apply:

```ts
import { Post } from './states.codegen';

const updatedPost = await engine
  .alterUniqueOrThrow(...Post)
  .update({
    title: 'My updated post',
    content: 'This is an updated post',
  })
  .unique({ id })
  .select();
```

Only the mutations that are available in all the requested states will be available to use. For example, running a `publish` mutation on `Post` states will fail to compile as the `publish` mutation is only available on `DraftPost` state.

## Querying entities

Querying entities is done by calling the `find*` methods on the engine. You're required to pass the states you want to query and the query you want to apply. The `.where()` method will accept a query object that will be validated against the states you're querying and the existing indexes you defeind on the states:

```ts
import { Post } from './states.codegen';

const posts = await engine
  .findMany(...Post)
  .where({ category: { $eq: { id: categoryId } } })
  .select();
```

Querying the entities is a completely type-safe operation. The query will be validated against the states you're querying and will fail to compile if the query is invalid. If you need to query entities using arbitrary conditions, you can use the `.filter()` method, which will accept any field on the state, but won't be optimized by the state's indexes.
