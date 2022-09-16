import { State } from '@/state/index.js';
import { Scalar } from '@neuledge/scalar';
import { ArrayType, UnionType } from './types.js';

export type Schema<Field extends SchemaField = SchemaField> = Record<
  string,
  Field
>;

export interface SchemaField {
  type: SchemaFieldType;
  nullable?: boolean;
}

export type SchemaFieldType =
  | Scalar
  | UnionType<State>
  | ArrayType<Scalar>
  | ArrayType<UnionType<State>>;
