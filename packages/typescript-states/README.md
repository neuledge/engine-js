# Neuledge Typescript States

A TypeScript code generator for [Neuledge Engine](https://github.com/neuledge/engine-js) "\*.states" files.

This library is not intended to be used directly. It is a dependency of the [main package](https://www.npmjs.com/package/@neuledge/engine).

## 📦 Installation

```bash
npm install @neuledge/typescript-states
```

## 🚀 Getting started

```states
import { generate } from '@neuledge/typescript-states';
import { StatesContext } from '@neuledge/states';
import { promises as fs } from 'fs';

// create a state context and load a state file
const ctx = new StatesContext();
await ctx.load([{
  source: await fs.readFile('posts.states', { encoding: 'utf8' }),
  filePath: 'posts.states',
}]);

// generate TypeScript code from the state context
await fs.writeFile('states.generated.ts', generate(ctx));
```

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
