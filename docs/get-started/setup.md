# Setup of Neuledge Engine

In order to install Neuledge Engine, create a new project folder and init a new [npm project](https://nodejs.org/en/download/) using:

```bash
mkdir my-project
cd my-project
npm init -y
```

Then, you can install Neuledge Engine using:

```bash
npm install @neuledge/engine
```

You may need to install the following development dependencies to support the TypeScript compilation and `*.states` files code generation:

```bash
npm install -D typescript @types/node @neuledge/states-cli
```

Once installed, you can create a `src` folder and a `tsconfig.json` file in the root of your project. The `tsconfig.json` file should look like this:

```json filename="tsconfig.json"
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "lib": ["es2022"],
    "module": "commonjs",
    "target": "es2022",

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,

    "outDir": "dist",
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
```

## Folder structure

Your code should be placed in the `src` folder. You can create a `states` folder in the root of your project and place your `*.states` files in it.

The folder structure of your project should look like this:

```
my-project
├── dist
├── node_modules
├── src
│   └── index.ts
├── states
│   └── my-state.states
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Build scripts

In order to compile your TypeScript code and generate code from your `*.states` files, you can add the following scripts to your `package.json` file:

```json filename="package.json"
{
  "scripts": {
    "generate:states": "states --output \"src/states.codegen.ts\" \"states/**/*.states\"",
    "build": "npm run generate:states && tsc",
    "watch": "tsc --watch"
  }
}
```

In order to generate the code for your `*.states` files, you can run the following command:

```bash
npm run generate:states
```

This will generate a `src/states.codegen.ts` file that contains the code from your `*.states` files. If you're using code versioning, you should add this file to your `.gitignore` file:

```gitignore filename=".gitignore"
# Ignore generated states code
src/states.codegen.ts
```
