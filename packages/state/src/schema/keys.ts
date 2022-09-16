import { Schema } from './index.js';

export type SchemaRequiredKeys<S extends Schema> = Exclude<
  {
    [K in keyof S]: [S[K]['nullable']] extends [true] ? never : K;
  }[keyof S],
  undefined
>;

export type SchemaNullableKeys<S extends Schema> = Exclude<
  {
    [K in keyof S]: [S[K]['nullable']] extends [true] ? K : never;
  }[keyof S],
  undefined
>;
