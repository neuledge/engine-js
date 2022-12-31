import { Scalar, ScalarInput, ScalarType, ScalarValue } from '@/scalar';

export type Parameters = Record<string, Parameter>;

export interface Parameter {
  type: Scalar;
  nullable?: boolean;
}

// types

export type ParametersType<P extends Parameters> = {
  [K in RequiredParameters<P>]: ScalarType<P[K]['type']>;
} & {
  [K in OptionalParameters<P>]?: ScalarType<P[K]['type']> | null;
};

export type ParametersInput<P extends Parameters> = {
  [K in RequiredParameters<P>]: ScalarInput<P[K]['type']>;
} & {
  [K in OptionalParameters<P>]?: ScalarInput<P[K]['type']> | null;
};

export type ParametersValue<P extends Parameters> = {
  [K in RequiredParameters<P>]: ScalarValue<P[K]['type']>;
} & {
  [K in OptionalParameters<P>]?: ScalarValue<P[K]['type']> | null;
};

// keys helpers

type RequiredParameters<P extends Parameters> = {
  [K in keyof P]: P[K]['nullable'] extends true ? never : K;
}[keyof P];

type OptionalParameters<P extends Parameters> = {
  [K in keyof P]: P[K]['nullable'] extends true ? K : never;
}[keyof P];
