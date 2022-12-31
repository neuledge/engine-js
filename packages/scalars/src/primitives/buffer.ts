import { createCallableScalar } from '@/generator';
import { Scalar } from '@/scalar';
import { buffer } from 'node:stream/consumers';
import { z } from 'zod';
import { NumberScalar } from './number';

export type BufferScalar = Buffer;
type BufferScalarInput = Buffer | string | number[] | Uint8Array | ArrayBuffer;

export const BufferScalar = createCallableScalar(
  {
    min: { type: NumberScalar, nullable: true },
    max: { type: NumberScalar, nullable: true },
  },
  ({ min, max }, key): Scalar<BufferScalar> => {
    let validator = z.instanceof(Buffer);

    if (min != null) {
      validator = validator.refine((value) => value.length >= min, {
        message: `Expected buffer with at least ${min} bytes`,
      });
    }

    if (max != null) {
      validator = validator.refine((value) => value.length <= max, {
        message: `Expected buffer with at most ${max} bytes`,
      });
    }

    return {
      type: 'Scalar',
      name: `Buffer${key}`,
      description:
        'The `Buffer` scalar type represents a binary data with a variable length.',
      encode: (value) => validator.parse(toBuffer(value)),
    };
  },
);

const numbersBuffer = z.array(z.number().int().min(0).max(255));

const toBuffer = (value: BufferScalarInput): Buffer => {
  if (value instanceof Buffer) {
    return value;
  }

  if (typeof value === 'string') {
    return Buffer.from(value, 'base64');
  }

  if (value instanceof Uint8Array || value instanceof ArrayBuffer) {
    return Buffer.from(value);
  }

  if (Array.isArray(value)) {
    return Buffer.from(numbersBuffer.parse(value));
  }

  return buffer as never;
};
