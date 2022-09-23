import { NamedDefinition } from './named.js';
import { TypeDefinition } from './type.js';

export interface FieldDefintion extends NamedDefinition {
  index: number;
  primaryKey?: boolean;
  nullable?: boolean;
  type: TypeDefinition;
}
