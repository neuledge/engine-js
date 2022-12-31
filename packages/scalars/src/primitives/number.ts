import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';
import { BooleanScalar } from './boolean';

export type NumberScalar = number;

const core: Scalar<NumberScalar> = {
  type: 'Scalar',
  name: 'Number',
  description:
    'The `Number` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',
  encode: (value) => z.number().parse(value),
};

export const NumberScalar = createCallableScalar(
  {
    min: { type: core, nullable: true },
    max: { type: core, nullable: true },
    after: { type: core, nullable: true },
    below: { type: core, nullable: true },
    integer: { type: BooleanScalar, nullable: true },
    finite: { type: BooleanScalar, nullable: true },
  },
  ({ min, max, after, below, integer, finite }, key): Scalar<NumberScalar> => {
    let validator = z.number();

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

    if (integer) {
      validator = validator.int();
    }

    if (finite) {
      validator = validator.finite();
    }

    return {
      type: 'Scalar',
      name: `Number${key}`,
      description: core.description,
      encode: (value) => validator.parse(value),
    };
  },
);
