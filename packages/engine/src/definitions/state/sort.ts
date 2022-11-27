export type SortDefinition<T> = readonly SortedField<keyof T & string>[];

export type SortDefinitionKey<K extends SortedField<string>> =
  K extends SortedField<infer R> ? R : never;

type SortedField<K extends string> = `${'+' | '-'}${K}`;

export const fromSortedField = <K extends string>(
  field: SortedField<K>,
): string => field.slice(1);
