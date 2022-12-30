import { State, Mutation } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import {
  generateParametersArgument,
  generateParametersType,
} from '../parameters';
import { generateFunctionBody } from '../function';

export const generateStateMutations = (state: State, indent: string): string =>
  Object.values(state.mutations)
    .map(
      (mutation) =>
        `\n${indent}${generateStateMutation(state, mutation, indent)}`,
    )
    .join('');

const generateStateMutation = (
  state: State,
  mutation: Mutation,
  indent: string,
): string => {
  let value;
  switch (mutation.mutation) {
    case 'create':
      value = generateCreateMutationFn(state, mutation, indent);
      break;

    case 'update':
      value = generateUpdateMutationFn(state, mutation, indent);
      break;

    case 'delete':
      value = generateDeleteMutationFn(state, mutation, indent);
      break;

    default:
      throw new Error(`Unknown mutation type: ${mutation.mutation}`);
  }

  return (
    generateDescriptionComment(mutation, indent) +
    `static ${mutation.name} = ${value};\n`
  );
};

const generateCreateMutationFn = (
  state: State,
  mutation: Mutation,
  indent: string,
): string => {
  const parameters = Object.values(mutation.parameters);

  if (!parameters.length) {
    return `$.mutation<typeof ${state.name}>('${
      mutation.mutation
    }', function () ${generateFunctionBody(indent)})`;
  }

  return (
    `$.mutation<\n` +
    `${indent}  typeof ${state.name},\n` +
    `${indent}  ${generateParametersType(parameters, `${indent}  `)}\n` +
    `${indent}>('${mutation.mutation}', function (${generateParametersArgument(
      parameters,
    )}) ${generateFunctionBody(indent)})`
  );
};

const generateUpdateMutationFn = (
  state: State,
  mutation: Mutation,
  indent: string,
): string => {
  const parameters = Object.values(mutation.parameters);

  if (!parameters.length) {
    return (
      `$.mutation<typeof ${state.name}, typeof ${mutation.returns.name}>(\n` +
      `${indent}  '${mutation.mutation}',\n` +
      `${indent}  function () ${generateFunctionBody(`${indent}  `)},\n` +
      `${indent})`
    );
  }

  return (
    `$.mutation<\n` +
    `${indent}  typeof ${state.name},\n` +
    `${indent}  ${generateParametersType(parameters, `${indent}  `)},\n` +
    `${indent}  typeof ${mutation.returns.name}\n` +
    `${indent}>('${mutation.mutation}', function (${generateParametersArgument(
      parameters,
    )}) ${generateFunctionBody(indent)})`
  );
};

const generateDeleteMutationFn = (
  state: State,
  mutation: Mutation,
  indent: string,
): string => {
  const parameters = Object.values(mutation.parameters);

  if (!mutation.body.length) {
    return `$.mutation<typeof ${state.name}>('${mutation.mutation}')`;
  }

  return (
    `$.mutation<\n` +
    `${indent}  typeof ${state.name},\n` +
    `${indent}  ${generateParametersType(parameters, `${indent}  `)}\n` +
    `${indent}>('${mutation.mutation}', function (${generateParametersArgument(
      parameters,
    )}) ${generateFunctionBody(indent)})`
  );
};
