import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';

export type IntegerScalar = number;

const core: Scalar<IntegerScalar> = {
  type: 'Scalar',
  name: 'Integer',
  description:
    'The `Integer` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.',
  encode: (value) => z.number().int().parse(value),
};

export const IntegerScalar = createCallableScalar(
  {
    min: { type: core, nullable: true },
    max: { type: core, nullable: true },
    after: { type: core, nullable: true },
    below: { type: core, nullable: true },
  },
  ({ min, max, after, below }, key): Scalar<IntegerScalar> => {
    let validator = z.number().int();

    if (min != null) {
      validator = validator.min(min);
    }

    if (max != null) {
      validator = validator.max(max);
    }

    if (after != null) {
      if (min != null) {
        throw new Error('Cannot set both `min` and `after`');
      }

      validator = validator.gt(after);
    }

    if (below != null) {
      if (max != null) {
        throw new Error('Cannot set both `max` and `below`');
      }

      validator = validator.lt(below);
    }

    return {
      type: 'Scalar',
      name: `Integer${key}`,
      description: core.description,
      encode: (value) => validator.parse(value),
    };
  },
);
