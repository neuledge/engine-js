import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { z } from 'zod';
import { dateTimeShape } from './shapes';

const MIN_NUMERIC_DATE = Date.UTC(2000, 0, 1);
const MAX_NUMERIC_DATE = Date.UTC(2100, 0, 1);

export type DateTimeScalar = Date;
type DateTimeScalarInput = string | number | Date;

const core: Scalar<DateTimeScalar, DateTimeScalarInput> = {
  type: 'Scalar',
  shape: dateTimeShape,
  name: 'DateTime',
  description:
    'The `DateTime` scalar type represents a date and time following the ISO-8601 standard.',
  encode: (value) => z.date().parse(toDate(value)),
};

export const DateTimeScalar = createCallableScalar(
  {
    min: { type: core, nullable: true },
    max: { type: core, nullable: true },
  },
  ({ min, max }, key): Scalar<DateTimeScalar, DateTimeScalarInput> => {
    let validator = z.date();

    if (min != null) {
      validator = validator.min(min);
    }

    if (max != null) {
      validator = validator.max(max);
    }

    return {
      ...core,
      name: `DateTime${key}`,
      encode: (value) => validator.parse(toDate(value)),
    };
  },
);

const stringDate = z.string().datetime({ offset: true });
const numericDate = z.number().min(MIN_NUMERIC_DATE).max(MAX_NUMERIC_DATE);

const toDate = (value: DateTimeScalarInput): Date => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    return new Date(stringDate.parse(value));
  }

  if (typeof value === 'number') {
    return new Date(numericDate.parse(value));
  }

  return value;
};
