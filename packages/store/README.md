# Neuledge Store

An abstract store interface for [Neuledge Engine](https://neuledge.com) in order to support different database implementations.

This library is not intended to be used directly. It is a dependency of the [main package](https://www.npmjs.com/package/@neuledge/engine).

## 📦 Installation

```bash
npm install @neuledge/states
```

## 🚀 Getting started

```ts
import { Store } from '@neuledge/store';

export class MyStore implements Store {
  // implement the store interface
}
```

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
