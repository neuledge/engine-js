import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z, ZodType } from 'zod';
import { getBigIntShape } from './shapes';

export type BigIntScalar = bigint;
type BigIntScalarInput = bigint | number;

const core: Scalar<BigIntScalar, BigIntScalarInput> = {
  type: 'Scalar',
  shape: getBigIntShape(),
  name: 'BigInt',
  description:
    'The `BigInt` scalar type represents non-fractional signed whole numeric values that may be larger than 2^53.',
  encode: (value) => z.bigint().parse(toBigInt(value)),
};

export const BigIntScalar = createCallableScalar(
  {
    min: { type: core, nullable: true },
    max: { type: core, nullable: true },
    after: { type: core, nullable: true },
    below: { type: core, nullable: true },
  },
  (
    { min, max, after, below },
    key,
  ): Scalar<BigIntScalar, BigIntScalarInput> => {
    let validator: ZodType<bigint> = z.bigint();
    let minRange: bigint | null = null;
    let maxRange: bigint | null = null;

    if (min != null) {
      minRange = min;
      validator = validator.refine((value) => value >= min, {
        message: `Must be greater than or equal to ${min}`,
      });
    }

    if (max != null) {
      maxRange = max;
      validator = validator.refine((value) => value <= max, {
        message: `Must be less than or equal to ${max}`,
      });
    }

    if (after != null) {
      if (min != null) {
        throw new TypeError('Cannot set both `min` and `after`');
      }

      minRange = after + 1n;
      validator = validator.refine((value) => value > after, {
        message: `Must be greater than ${after}`,
      });
    }

    if (below != null) {
      if (max != null) {
        throw new TypeError('Cannot set both `max` and `below`');
      }

      maxRange = below - 1n;
      validator = validator.refine((value) => value < below, {
        message: `Must be less than ${below}`,
      });
    }

    return {
      ...core,
      name: `BigInt${key}`,
      shape: getBigIntShape(minRange, maxRange),
      encode: (value) => validator.parse(toBigInt(value)),
    };
  },
);

const toBigInt = (value: BigIntScalarInput): BigIntScalar => {
  if (typeof value === 'bigint') {
    return value;
  }

  if (typeof value === 'number') {
    return BigInt(value);
  }

  return value;
};
