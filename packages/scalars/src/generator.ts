import { StoreValueShapeType } from '@neuledge/store';
import { ParametersType, Parameters } from './parameters';
import { Scalar } from './scalar';

export interface ScalarGenerator<
  P extends Parameters = Parameters,
  S extends Scalar = Scalar,
> {
  type: 'ScalarGenerator';
  name: string;
  description?: string;
  deprecated?: string | true;
  parameters: P;
  (args: ParametersType<P>): S;
}

export interface CallableScalar<
  P extends Parameters = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Type = any, // eslint-disable-line @typescript-eslint/no-explicit-any
  Input = Type,
  Value = Type,
  Encoding extends StoreValueShapeType<Value> = StoreValueShapeType<Value>,
> extends Scalar<Type, Input, Value, Encoding> {
  parameters: P;
  (args: ParametersType<P>): Scalar<Type, Input, Value>;
}

export const createScalarGenerator = <P extends Parameters, S extends Scalar>(
  { name, ...props }: Pick<ScalarGenerator<P, S>, keyof ScalarGenerator<P, S>>,
  generator: (
    args: ParametersType<P> | Record<string, never>,
    key: string,
  ) => S,
): ScalarGenerator<P, S> => {
  const target = (parameters: ParametersType<P>): S =>
    generator(parameters, getParametersKey(parameters));

  Object.defineProperty(target, 'name', { value: name, writable: false });

  return Object.assign(target, props);
};

export const createCallableScalar = <
  P extends Parameters,
  Type,
  Input,
  Value,
  Encoding extends StoreValueShapeType<Value>,
>(
  parameters: P,
  generator: (
    args: ParametersType<P> | Record<string, never>,
    key: string,
  ) => Scalar<Type, Input, Value, Encoding>,
): CallableScalar<P, Type, Input, Value, Encoding> => {
  const { name, ...props } = generator({}, '');

  const target = (parameters: ParametersType<P>): Scalar<Type, Input, Value> =>
    generator(parameters, getParametersKey(parameters));

  Object.defineProperty(target, 'name', { value: name, writable: false });

  return Object.assign(target, { parameters, ...props });
};

const getParametersKey = <P extends Parameters>(
  parameters: ParametersType<P>,
): string => {
  const parametersStr = Object.entries(parameters)
    .filter(([, value]) => value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${escapeKey(key)}: ${escapeValue(value)}`)
    .join(', ');

  if (!parametersStr) {
    return '';
  }

  return `(${parametersStr})`;
};

const escapeKey = (key: string): string =>
  /^[_a-z]\w*$/i.test(key) ? key : JSON.stringify(key);

const escapeValue = (value: unknown): string => {
  switch (typeof value) {
    case 'string':
    default:
      return JSON.stringify(value);

    case 'number':
    case 'boolean':
      return String(value);
  }
};
