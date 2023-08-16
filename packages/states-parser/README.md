# Neuledge States Parser

An state parser for [Neuledge Engine](https://github.com/neuledge/engine-js) state language.

This library is not intended to be used directly. It is a dependency of the [main package](https://www.npmjs.com/package/@neuledge/engine).

## 📦 Installation

```bash
npm install @neuledge/states-parser
```

## 🚀 Getting started

```states
import { parseStates } from '@neuledge/states-parser';

// parse a state file and return a document node
const doc = parseStates(`
  state Post {
    id: Integer;
    title: String;
    content: String;
    createdAt: DateTime;
    updatedAt: DateTime;
  }
`);
```

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
