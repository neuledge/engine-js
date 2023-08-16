# Neuledge States CLI

A CLI tool for [Neuledge Engine](https://github.com/neuledge/engine-js) that can be used to generate TypeScript code from state files.

## 📦 Installation

```bash
npm install @neuledge/states-cli --save-dev
```

## 🚀 Getting started

Add the following script to your `package.json`:

```json
{
  "scripts": {
    "generate:states": "states --output \"src/states.codegen.ts\" \"states/*.states\""
  }
}
```

Then, run the following command:

```bash
npm run generate:states
```

For more information, please refer to the [main repository](https://github.com/neuledge/engine-js).

## 📄 License

Neuledge is [Apache 2.0 licensed](https://github.com/neuledge/engine-js/blob/main/LICENSE).
