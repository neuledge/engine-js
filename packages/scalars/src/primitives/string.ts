import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';
import { BooleanScalar } from './boolean';
import { IntegerScalar } from './integer';
import { getStringShape } from './shapes';

export type StringScalar = string;

const core: Scalar<StringScalar> = {
  type: 'Scalar',
  shape: getStringShape(),
  name: `String`,
  description:
    'The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used to represent free-form human-readable text.',
  encode: (value) => z.string().parse(value),
};

export const StringScalar = createCallableScalar(
  {
    min: { type: IntegerScalar({ min: 0 }), nullable: true },
    max: { type: IntegerScalar({ min: 0 }), nullable: true },
    trim: { type: BooleanScalar, nullable: true },
    startsWith: { type: core, nullable: true },
    endsWith: { type: core, nullable: true },
    regex: { type: core, nullable: true },
  },
  (
    { min, max, trim, startsWith, endsWith, regex },
    key,
  ): Scalar<StringScalar> => {
    let validator = z.string();

    if (trim) {
      validator = validator.trim();
    }

    if (min != null) {
      validator = validator.min(min);
    }

    if (max != null) {
      if (min != null && min > max) {
        throw new TypeError('`min` cannot be greater than `max`');
      }

      validator = validator.max(max);
    }

    if (startsWith != null) {
      validator = validator.refine((value) => value.startsWith(startsWith), {
        message: `Must start with "${startsWith}"`,
      }) as never;
    }

    if (endsWith != null) {
      validator = validator.refine((value) => value.endsWith(endsWith), {
        message: `Must end with "${endsWith}"`,
      }) as never;
    }

    if (regex != null) {
      validator = validator.regex(new RegExp(regex));
    }

    return {
      ...core,
      shape: getStringShape(max),
      name: `String${key}`,
      encode: (value) => validator.parse(value),
    };
  },
);
