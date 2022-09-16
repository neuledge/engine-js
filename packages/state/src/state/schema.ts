import { Schema } from '@/schema/index.js';
import { Scalar } from '@neuledge/scalar';
import { StateFieldType } from '../field.js';

export type StateSchema = Schema<StateSchemaField>;

type StateSchemaField =
  | {
      index: number;
      type: StateFieldType;
      nullable: true;
      primaryKey?: false;
    }
  | {
      index: number;
      type: Scalar;
      nullable?: false;
      primaryKey: true;
    }
  | {
      index: number;
      type: StateFieldType;
      nullable?: false;
      primaryKey?: false;
    };
