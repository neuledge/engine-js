import { createCallableScalar } from '@/generator';
import { BooleanScalar, StringScalar } from '@/primitives';
import { getStringShape } from '@/primitives/shapes';
import { Scalar } from '@/scalar';
import { z } from 'zod';

// https://stackoverflow.com/a/14402437/518153
const DOMAIN_MAX_LENGTH = 253;

export type URLScalar = string;

export const URLScalar = createCallableScalar(
  {
    domain: {
      type: StringScalar({
        max: DOMAIN_MAX_LENGTH,
        regex: '^([a-zA-Z0-9]+([\\.-]?[a-zA-Z0-9]+)*)+$',
        trim: true,
      }),
      nullable: true,
    },
    protocol: {
      type: StringScalar({
        max: 10,
        regex: '^[a-zA-Z0-9]+$',
        trim: true,
      }),
      nullable: true,
    },
    secure: { type: BooleanScalar, nullable: true },
  },
  ({ domain, secure, protocol }, key): Scalar<StringScalar> => {
    let validator = z.string().trim().url();

    if (domain != null) {
      const regex = new RegExp(
        `://([a-z0-9]+(-[a-z0-9]+)*\\.)*${domain.replaceAll('.', '\\.')}/`,
        'i',
      );

      validator = validator.refine((value) => value.match(regex), {
        message: `Must be a URL with domain "${domain}"`,
      }) as never;
    }

    if (secure != null) {
      if (protocol != null) {
        throw new TypeError('Cannot specify both "secure" and "protocol"');
      }

      validator = validator.refine((value) => value.startsWith('https://'), {
        message: `Must be a secure URL`,
      }) as never;
    } else if (protocol != null) {
      validator = validator.refine(
        (value) => value.startsWith(`${protocol}://`),
        {
          message: `Must be a URL with protocol "${protocol}"`,
        },
      ) as never;
    }

    return {
      type: 'Scalar',
      shape: getStringShape(),
      name: `URL${key}`,
      description: 'The `URL` scalar type represents a string URL.',
      encode: (value) => validator.parse(value),
    };
  },
);
