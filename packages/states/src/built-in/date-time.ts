import { BuiltInScalar } from './scalar';

export const DateTimeScalar: BuiltInScalar<'DateTime'> = {
  type: 'Scalar',
  name: 'DateTime',
  description:
    'The `DateTime` scalar type represents fully date and time value, represented as a simplified extended ISO format ([ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)), which is always 24 or 27 characters long (`YYYY-MM-DDTHH:mm:ss.sssZ` or `±YYYYYY-MM-DDTHH:mm:ss.sssZ`, respectively). The timezone is always zero UTC offset, as denoted by the suffix `Z`',
  builtIn: true,
};
