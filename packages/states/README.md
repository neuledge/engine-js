# Neuledge States

An internal context and state management library for [Neuledge Engine](https://github.com/neuledge/engine-js).

This library is not intended to be used directly. It is a dependency of the [main package](https://www.npmjs.com/package/@neuledge/engine).

## 📦 Installation

```bash
npm install @neuledge/states
```

## 🚀 Getting started

```states
import { StatesContext } from '@neuledge/states';
import { promises as fs } from 'fs';

const ctx = new StatesContext();

// load a state file
await ctx.load([{
  source: await fs.readFile('posts.states', { encoding: 'utf8' }),
  filePath: 'posts.states',
}]);

for (const state of ctx.states) {
  // do something with the state
}
```

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
