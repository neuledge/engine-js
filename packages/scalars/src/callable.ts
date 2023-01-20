import { ScalarType } from './scalar';
import { Parameter, Parameters, ParametersType } from './parameters';

export interface Callable<
  P extends Parameters = Parameters,
  R extends Parameter = Parameter,
> {
  name: string;
  parameters: P;
  returnType: R;
  (args: ParametersType<P>): Resolveable<ReturnParameterType<R>>;
}

export type ReturnParameterType<P extends Parameter> =
  | (P extends Parameter<infer S> ? ScalarType<S> : never)
  | (P['nullable'] extends true ? null : never);

type Resolveable<T> = T | PromiseLike<T>;

export const createCallable = <P extends Parameters, R extends Parameter>(
  name: string,
  parameters: P,
  returnType: R,
  callable: (args: ParametersType<P>) => Resolveable<ReturnParameterType<R>>,
): Callable<P, R> => {
  Object.defineProperty(callable, 'name', { value: name, writable: false });

  return Object.assign(callable, { parameters, returnType });
};
