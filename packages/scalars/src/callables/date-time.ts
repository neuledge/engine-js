import { createCallable } from '@/callable';
import { DateTimeScalar } from '@/primitives';

export const DateTime = createCallable(
  'DateTime',
  {
    now: { type: DateTimeScalar, nullable: true },
  },
  { type: DateTimeScalar },
  ({ now }) => {
    if (now != null) {
      return new Date(now);
    }

    return new Date();
  },
);
