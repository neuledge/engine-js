import { Scalar } from '@neuledge/scalar';
import { StateFieldType } from './Field.js';

export type StateSchema = {
  [Key in string]: SchemaFieldProperties;
};

type SchemaFieldProperties =
  | {
      index: number;
      type: StateFieldType;
      nullable: boolean;
      primaryKey?: never;
    }
  | {
      index: number;
      type: Scalar;
      nullable?: never;
      primaryKey: boolean;
    }
  | {
      index: number;
      type: StateFieldType;
      nullable?: never;
      primaryKey?: never;
    };
