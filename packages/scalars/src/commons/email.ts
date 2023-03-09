import { createCallableScalar } from '@/generator';
import { StringScalar } from '@/primitives';
import { getStringShape } from '@/primitives/shapes';
import { Scalar } from '@/scalar';
import { z } from 'zod';

// https://www.rfc-editor.org/errata/eid1690
// const EMAIL_LOCAL_PART_MAX_LENGTH = 64;
const EMAIL_DOMAIN_MAX_LENGTH = 255;
const EMAIL_MAX_LENGTH = 320;

export type EmailScalar = string;

export const EmailScalar = createCallableScalar(
  {
    at: {
      type: StringScalar({
        max: EMAIL_DOMAIN_MAX_LENGTH,
        regex: '^[a-zA-Z0-9]+([\\.-]?[a-zA-Z0-9]+)*(\\.[a-zA-Z0-9]{2,3})+$',
        trim: true,
      }),
      nullable: true,
    },
  },
  ({ at }, key): Scalar<StringScalar> => {
    let validator = z.string().trim().email();

    if (at != null) {
      validator = validator.refine((value) => value.endsWith(`@${at}`), {
        message: `Must be an email address at "${at}"`,
      }) as never;
    }

    return {
      type: 'Scalar',
      shape: getStringShape(EMAIL_MAX_LENGTH),
      name: `Email${key}`,
      description: 'The `Email` scalar type represents a string email address.',
      encode: (value) => validator.parse(value),
    };
  },
);
