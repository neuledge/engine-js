import { createScalar, Scalar, ClassScalar } from '@neuledge/scalar';
import { createDecorator, getPropertyMetadata } from './utils.js';

const metadataKey = Symbol('Field');

export interface FieldMetadata {
  index: number;
  type: ClassScalar;
  nullable: boolean;
}

export type FieldOptions = Partial<Pick<FieldMetadata, 'nullable'>>;

export const Field = (index: number, type: Scalar, opts?: FieldOptions) =>
  createDecorator<FieldMetadata>(metadataKey, {
    index,
    type: createScalar(type),
    nullable: !!opts?.nullable,
  });

export const getFieldMetadata = getPropertyMetadata<FieldMetadata>(metadataKey);
