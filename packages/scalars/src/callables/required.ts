import { createCallable } from '@/callable';
import { DateTimeScalar, StringScalar } from '@/primitives';

export const Required = createCallable(
  'Required',
  {
    value: { type: DateTimeScalar, nullable: true },
    message: { type: StringScalar, nullable: true },
  },
  { type: DateTimeScalar },
  ({ value, message }) => {
    if (value == null) {
      throw new Error(message ?? 'Required value is null or undefined');
    }

    return value;
  },
);
