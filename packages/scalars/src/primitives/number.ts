import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';
import { BooleanScalar } from './boolean';
import { IntegerScalar } from './integer';
import { getNumberShape } from './shapes';

export type NumberScalar = number;

const core: Scalar<NumberScalar> = {
  type: 'Scalar',
  shape: getNumberShape(),
  name: 'Number',
  description:
    'The `Number` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point).',
  encode: (value) => z.number().parse(value),
};

const validatePrecision = (
  precision: number,
  scale: number,
  max?: number | null,
  below?: number | null,
) => {
  if (precision < scale) {
    throw new TypeError('`precision` must be greater than or equal to `scale`');
  }

  const digits = precision - scale;
  const digitsBelow = 10 ** digits;

  if (max != null) {
    if (max >= digitsBelow) {
      throw new TypeError(
        `Cannot set 'max' greater than equal ${digitsBelow} for 'precision' of ${precision} and 'scale' of ${scale}`,
      );
    }
  } else if (below == null) {
    below = digitsBelow;
  } else {
    if (below > digitsBelow) {
      throw new TypeError(
        `Cannot set 'below' greater than ${digitsBelow} for 'precision' of ${precision} and 'scale' of ${scale}`,
      );
    }
  }

  return { below };
};

export const NumberScalar = createCallableScalar(
  {
    min: { type: core, nullable: true },
    max: { type: core, nullable: true },
    after: { type: core, nullable: true },
    below: { type: core, nullable: true },
    finite: { type: BooleanScalar, nullable: true },
    precision: { type: IntegerScalar({ min: 1, max: 1000 }), nullable: true },
    scale: { type: IntegerScalar({ min: 1, max: 1000 }), nullable: true },
  },
  (
    { min, max, after, below, finite, precision, scale },
    key,
  ): Scalar<NumberScalar> => {
    let validator = z.number();

    if (precision != null && scale != null) {
      ({ below } = validatePrecision(precision, scale, max, below));
    }

    if (min != null) {
      validator = validator.min(min);
    }

    if (max != null) {
      validator = validator.max(max);
    }

    if (after != null) {
      if (min != null) {
        throw new TypeError('Cannot set both `min` and `after`');
      }

      validator = validator.gt(after);
    }

    if (below != null) {
      if (max != null) {
        throw new TypeError('Cannot set both `max` and `below`');
      }

      validator = validator.lt(below);
    }

    if (finite) {
      validator = validator.finite();
    }

    return {
      ...core,
      name: `Number${key}`,
      shape: getNumberShape(precision, scale),
      encode: (value) => validator.parse(value),
    };
  },
);
