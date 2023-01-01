import { Scalar, ScalarType } from './scalar';
import { Parameters, ParametersType } from './parameters';

export interface Callable<
  P extends Parameters = Parameters,
  R extends Scalar = Scalar,
> {
  name: string;
  parameters: P;
  returnType: R;
  (args: ParametersType<P>): Resolveable<ScalarType<R>>;
}

type Resolveable<T> = T | PromiseLike<T>;

export const createCallable = <P extends Parameters, R extends Scalar>(
  name: string,
  parameters: P,
  returnType: R,
  callable: (args: ParametersType<P>) => Resolveable<ScalarType<R>>,
): Callable<P, R> => {
  Object.defineProperty(callable, 'name', { value: name, writable: false });

  return Object.assign(callable, { parameters, returnType });
};
