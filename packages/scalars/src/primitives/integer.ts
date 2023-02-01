import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';
import { getIntergerShape } from './shapes';

export type IntegerScalar = number;

const core: Scalar<IntegerScalar> = {
  type: 'Scalar',
  shape: getIntergerShape(),
  name: 'Integer',
  description:
    'The `Integer` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^53 - 1) and 2^53 - 1.',
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
    let minRange = -Infinity;
    let maxRange = Infinity;

    if (min != null) {
      minRange = min;
      validator = validator.min(min);
    }

    if (max != null) {
      maxRange = max;
      validator = validator.max(max);
    }

    if (after != null) {
      if (min != null) {
        throw new Error('Cannot set both `min` and `after`');
      }

      minRange = Math.floor(after) + 1;
      validator = validator.gt(after);
    }

    if (below != null) {
      if (max != null) {
        throw new Error('Cannot set both `max` and `below`');
      }

      maxRange = Math.ceil(below) - 1;
      validator = validator.lt(below);
    }

    return {
      ...core,
      name: `Integer${key}`,
      shape: getIntergerShape(minRange, maxRange),
      encode: (value) => validator.parse(value),
    };
  },
);
