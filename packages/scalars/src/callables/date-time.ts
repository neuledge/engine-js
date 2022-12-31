import { createCallable } from '@/callable';
import { DateTimeScalar } from '@/primitives';

export const DateTime = createCallable(
  {
    now: { type: DateTimeScalar, nullable: true },
  },
  DateTimeScalar,
  ({ now }) => {
    if (now != null) {
      return new Date(now);
    }

    return new Date();
  },
);
