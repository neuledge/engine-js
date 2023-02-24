# Neuledge Scalars

A set of [Neuledge Engine](https://neuledge.com) scalars that can be used on the schema definition.

This library is not intended to be used directly. It is a dependency of the [main package](https://www.npmjs.com/package/@neuledge/engine).

## 📦 Installation

```bash
npm install @neuledge/scalars
```

## 🚀 Getting started

```ts
import { Integer, String, DateTime } from '@neuledge/scalars';

// define the state scalars
const stateScalars = {
  id: { type: Integer, index: 1 },
  name: { type: String, index: 2 },
  description: { type: String, index: 3, nullable: true },
};

// validate a scalar value
const value: ScalarValue<typeof DateTime> = DateTime.encode(
  new Date('2020-01-01'),
); // 1577836800000

// decode a scalar value
const decodedValue: DateTime = DateTime.decode(value); // Date('2020-01-01')
```

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
