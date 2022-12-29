import { createScalarGeneratorScalar } from '@/generator';
import { Scalar } from '@/scalar';

export type StringScalar = string;

export const StringScalar = createScalarGeneratorScalar(
  ({
    min,
    max,
  }: {
    min?: number | null;
    max?: number | null;
  }): Scalar<StringScalar> => ({
    key:
      min == null
        ? max == null
          ? 'String'
          : `String(${max})`
        : max == null
        ? `String(${min},)`
        : `String(${max},${min})`,

    encode: (value) => {
      if (min != null && value.length < min) {
        throw new RangeError(
          `Expect string to have minimum length of ${min} characters`,
        );
      }

      if (max != null && value.length > max) {
        throw new RangeError(
          `Expect string to have maximum length of ${max} characters`,
        );
      }

      return value;
    },
  }),
);
