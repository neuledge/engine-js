import { State, Mutation } from '@neuledge/states';
import { generateDescriptionComment } from '../comments';
import {
  generateParametersArgument,
  generateParametersType,
} from '../parameters';
import { generateStateFunctionBody } from '../property';

export const generateStateOptionalTransforms = (
  state: State,
  indent: string,
): string | null => {
  const transforms = Object.values(state.mutations)
    .filter(
      (item) => item.mutation === 'update' && item.returns.name !== state.name,
    )
    .map((item) => item.returns);

  if (!transforms.length) {
    return null;
  }

  if (transforms.length <= 3) {
    return `() => [${transforms.map((item) => item.name).join(', ')}]`;
  }

  return `() => [${transforms
    .map((item) => `\n${indent}  ${item.name},`)
    .join('')}\n${indent}]`;
};

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
    case 'create': {
      value = generateCreateMutationFn(state, mutation, indent);
      break;
    }

    case 'update': {
      value = generateUpdateMutationFn(state, mutation, indent);
      break;
    }

    case 'delete': {
      value = generateDeleteMutationFn(state, mutation, indent);
      break;
    }

    default: {
      throw new Error(`Unknown mutation type: ${mutation.mutation}`);
    }
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
  const properties = Object.values(mutation.body);

  if (!parameters.length) {
    return `$.mutation<typeof ${state.name}>('${
      mutation.mutation
    }', async function () ${generateStateFunctionBody(
      state,
      properties,
      false,
      indent,
    )})`;
  }

  return (
    `$.mutation<\n` +
    `${indent}  typeof ${state.name},\n` +
    `${indent}  ${generateParametersType(parameters, `${indent}  `)}\n` +
    `${indent}>('${
      mutation.mutation
    }', async function (${generateParametersArgument(
      parameters,
    )}) ${generateStateFunctionBody(state, properties, false, indent)})`
  );
};

const generateUpdateMutationFn = (
  state: State,
  mutation: Mutation,
  indent: string,
): string => {
  const parameters = Object.values(mutation.parameters);
  const properties = Object.values(mutation.body);

  if (!parameters.length) {
    return (
      `$.mutation<typeof ${state.name}, typeof ${mutation.returns.name}>(\n` +
      `${indent}  '${mutation.mutation}',\n` +
      `${indent}  async function () ${generateStateFunctionBody(
        mutation.returns as State,
        properties,
        true,
        `${indent}  `,
      )},\n` +
      `${indent})`
    );
  }

  return (
    `$.mutation<\n` +
    `${indent}  typeof ${state.name},\n` +
    `${indent}  ${generateParametersType(parameters, `${indent}  `)},\n` +
    `${indent}  typeof ${mutation.returns.name}\n` +
    `${indent}>('${
      mutation.mutation
    }', async function (${generateParametersArgument(
      parameters,
    )}) ${generateStateFunctionBody(
      mutation.returns as State,
      properties,
      true,
      indent,
    )})`
  );
};

const generateDeleteMutationFn = (
  state: State,
  mutation: Mutation,
  indent: string,
): string => {
  const parameters = Object.values(mutation.parameters);
  const properties = Object.values(mutation.body);

  if (!properties.length) {
    return `$.mutation<typeof ${state.name}>('${mutation.mutation}')`;
  }

  return (
    `$.mutation<\n` +
    `${indent}  typeof ${state.name},\n` +
    `${indent}  ${generateParametersType(parameters, `${indent}  `)}\n` +
    `${indent}>('${
      mutation.mutation
    }', async function (${generateParametersArgument(
      parameters,
    )}) ${generateStateFunctionBody(state, properties, true, indent)})`
  );
};
