export const generateImports = (): string =>
  `import { $ } from '@neuledge/engine';\n` +
  `import {\n` +
  `  NumberScalar as Number,\n` +
  `  StringScalar as String,\n` +
  `  DateTimeScalar as DateTime,\n` +
  `} from '@neuledge/scalars';`;
