import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';
import { BooleanScalar } from './boolean';
import { IntegerScalar } from './integer';
import { getStringShape } from './shapes';

export type StringScalar = string;

export const StringScalar = createCallableScalar(
  {
    min: { type: IntegerScalar({ min: 0 }), nullable: true },
    max: { type: IntegerScalar({ min: 0 }), nullable: true },
    trim: { type: BooleanScalar, nullable: true },
  },
  ({ min, max, trim }, key): Scalar<StringScalar> => {
    let validator = z.string();

    if (min != null) {
      validator = validator.min(min);
    }

    if (max != null) {
      if (min != null && min > max) {
        throw new Error('`min` cannot be greater than `max`');
      }

      validator = validator.max(max);
    }

    if (trim) {
      validator = validator.trim();
    }

    return {
      type: 'Scalar',
      shape: getStringShape(max),
      name: `String${key}`,
      description:
        'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used to represent free-form human-readable text.',
      encode: (value) => validator.parse(value),
    };
  },
);
