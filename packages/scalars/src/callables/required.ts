import { Callable, createCallable } from '@/callable';
import { StringScalar, UnknownScalar } from '@/primitives';

const parameters = {
  value: { type: UnknownScalar, nullable: true, generic: 'T' as const },
  message: { type: StringScalar, nullable: true },
};

const returnType = { type: UnknownScalar, generic: 'T' as const };

export const Required = createCallable(
  'Required',
  parameters,
  returnType,
  <T>({
    value,
    message,
  }: {
    value?: T | null | undefined;
    message?: string | undefined | null;
  }) => {
    if (value == null) {
      throw new TypeError(message ?? 'Required value is null or undefined');
    }

    return value;
  },
) as (<T>(args: {
  value?: T | null | undefined;
  message?: string | undefined | null;
}) => NonNullable<T>) &
  Callable<typeof parameters, typeof returnType>;
