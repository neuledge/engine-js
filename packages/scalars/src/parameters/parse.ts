import { Parameters, ParametersType, ParametersInput } from './parameters';

export const parseParametersInput = <P extends Parameters>(
  parameters: P,
): ((input: ParametersInput<P>) => ParametersType<P>) => {
  const entries = Object.entries(parameters);

  return (input) =>
    Object.fromEntries(
      entries
        .filter(([key, parameter]) => !parameter.nullable || key in input)
        .map(([key, parameter]) => {
          const value = input[key as never];

          if (parameter.nullable && value == null) {
            return [key, value];
          }

          return [key, parameter.type.encode(value)];
        }),
    ) as ParametersType<P>;
};
