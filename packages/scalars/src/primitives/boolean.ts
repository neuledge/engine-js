import { Scalar } from '@/scalar';
import { z } from 'zod';

// boolean

export type BooleanScalar = boolean;
type BooleanScalarInput = TrueScalarInput | FalseScalarInput;

export const BooleanScalar: Scalar<BooleanScalar, BooleanScalarInput> = {
  type: 'Scalar',
  name: 'Boolean',
  description: 'The `Boolean` scalar type represents `true` or `false`.',
  encode: (value) =>
    z.boolean().or(trueLiterals).or(falseLiterals).parse(value),
};

// true

export type TrueScalar = true;
type TrueScalarInput =
  | true
  | 1
  | 'true'
  | 'yes'
  | 'True'
  | 'Yes'
  | 'TRUE'
  | 'YES';

export const TrueScalar: Scalar<TrueScalar, TrueScalarInput> = {
  type: 'Scalar',
  name: 'True',
  description: 'The `True` scalar type represents only `true` value.',
  encode: (value) => z.literal(true).or(trueLiterals).parse(value),
};

// false

export type FalseScalar = false;
type FalseScalarInput =
  | false
  | 0
  | 'false'
  | 'no'
  | 'False'
  | 'No'
  | 'FALSE'
  | 'NO';

export const FalseScalar: Scalar<FalseScalar, FalseScalarInput> = {
  type: 'Scalar',
  name: 'False',
  description: 'The `False` scalar type represents only `false` value.',
  encode: (value) => z.literal(false).or(falseLiterals).parse(value),
};

// literals helpers

const trueLiterals = z
  .union([
    z.literal(1),
    z.literal('true'),
    z.literal('yes'),
    z.literal('True'),
    z.literal('Yes'),
    z.literal('TRUE'),
    z.literal('YES'),
  ])
  .transform(() => true as const);

const falseLiterals = z
  .union([
    z.literal(0),
    z.literal('false'),
    z.literal('no'),
    z.literal('False'),
    z.literal('No'),
    z.literal('FALSE'),
    z.literal('NO'),
  ])
  .transform(() => false as const);
