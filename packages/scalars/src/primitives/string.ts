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

const formatValidator = ({
  trim,
  normalize,
  lowercase,
  uppercase,
}: {
  trim?: boolean | null;
  normalize?: boolean | null;
  lowercase?: boolean | null;
  uppercase?: boolean | null;
}) => {
  let validator = z.string();

  if (trim) {
    validator = validator.trim();
  }

  if (normalize) {
    validator = validator.transform((value) => value.normalize()) as never;
  }

  if (lowercase) {
    if (uppercase) {
      throw new TypeError(
        '`lowercase` and `uppercase` cannot be used together',
      );
    }

    validator = validator.transform((value) => value.toLowerCase()) as never;
  } else if (uppercase) {
    validator = validator.transform((value) => value.toUpperCase()) as never;
  }

  return validator;
};

export const StringScalar = createCallableScalar(
  {
    min: { type: IntegerScalar({ min: 0 }), nullable: true },
    max: { type: IntegerScalar({ min: 0 }), nullable: true },
    trim: { type: BooleanScalar, nullable: true },
    lowercase: { type: BooleanScalar, nullable: true },
    uppercase: { type: BooleanScalar, nullable: true },
    normalize: { type: BooleanScalar, nullable: true },
    startsWith: { type: core, nullable: true },
    endsWith: { type: core, nullable: true },
    regex: { type: core, nullable: true },
  },
  (
    { min, max, startsWith, endsWith, regex, ...format },
    key,
  ): Scalar<StringScalar> => {
    let validator = formatValidator(format);

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
