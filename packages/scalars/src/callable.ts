import { Scalar, ScalarType } from './scalar';
import { Parameters, ParametersType } from './parameters';

export interface Callable<P extends Parameters, R extends Scalar> {
  (args: ParametersType<P>): Resolveable<ScalarType<R>>;
  parameters: P;
  returnType: R;
}

type Resolveable<T> = T | PromiseLike<T>;

export const createCallable = <P extends Parameters, R extends Scalar>(
  parameters: P,
  returnType: R,
  callable: (args: ParametersType<P>) => Resolveable<ScalarType<R>>,
): Callable<P, R> => Object.assign(callable, { parameters, returnType });
