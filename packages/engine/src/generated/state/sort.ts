export type StateSort<T> = readonly SortedField<keyof T & string>[];

type SortedField<K extends string> = `${'+' | '-'}${K}`;
