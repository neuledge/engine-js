import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';
import { BooleanScalar } from './boolean';
import { NumberScalar } from './number';

export type StringScalar = string;

export const StringScalar = createCallableScalar(
  {
    min: { type: NumberScalar, nullable: true },
    max: { type: NumberScalar, nullable: true },
    trim: { type: BooleanScalar, nullable: true },
  },
  ({ min, max, trim }, key): Scalar<StringScalar> => {
    let validator = z.string();

    if (min != null) {
      validator = validator.min(min);
    }

    if (max != null) {
      validator = validator.max(max);
    }

    if (trim) {
      validator = validator.trim();
    }

    return {
      type: 'Scalar',
      name: `String${key}`,
      description:
        'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used to represent free-form human-readable text.',
      encode: (value) => validator.parse(value),
    };
  },
);
