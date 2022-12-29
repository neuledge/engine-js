export const generateImports = (): string =>
  `import { $ } from '@neuledge/engine';\n` +
  `import {\n` +
  `  BooleanScalar as Boolean,\n` +
  `  BufferScalar as Buffer,\n` +
  `  NumberScalar as Number,\n` +
  `  StringScalar as String,\n` +
  `  ObjectScalar as Object,\n` +
  `  DateTimeScalar as DateTime,\n` +
  `} from '@neuledge/scalars';`;
