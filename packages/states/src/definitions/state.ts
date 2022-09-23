import { FieldDefintion } from './field.js';
import { NamedDefinition } from './named.js';

export interface StateDefinition extends NamedDefinition {
  fields: FieldDefintion[];
  indexes?: StateIndexDefinition[];
}

export interface StateIndexDefinition {
  // type: never;
  unique?: boolean;
  fields: FieldDefintion[];
}
