import { StatesContext } from '@/context';
import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { parseType, Type } from '@/type';
import { ParameterNode, ParsingError } from '@neuledge/states-parser';
import { z } from 'zod';
import { Either } from './either';
import { State } from './state';

export interface ParametersContext {
  this: State | Either | null;
  parameters: Record<string, Parameter>;
}

export interface Parameter {
  type: 'Parameter';
  node: ParameterNode;
  name: string;
  description?: string;
  deprecated?: boolean | string;
  nullable: boolean;
  as: Type;
}

export const parseParametersContext = (
  ctx: StatesContext,
  target: State | Either | null,
  nodes: ParameterNode[],
): ParametersContext => ({
  this: target,
  parameters: parseParameters(ctx, nodes),
});

export const parseParameters = (
  ctx: StatesContext,
  nodes: ParameterNode[],
): Record<string, Parameter> => {
  const parameters: Record<string, Parameter> = {};

  for (const node of nodes) {
    if (node.key.name in parameters) {
      throw new ParsingError(
        node.key,
        `Duplicate parameter name '${node.key.name}'`,
      );
    }

    parameters[node.key.name] = parseParameter(ctx, node);
  }

  return parameters;
};

const parseParameter = (ctx: StatesContext, node: ParameterNode): Parameter => {
  const parameter: Parameter = {
    type: 'Parameter',
    node,
    name: node.key.name,
    description: node.description?.value,
    nullable: node.nullable,
    as: parseType(ctx, node.as),
  };

  applyDecorators(parameter, node.decorators, decorators);

  return parameter;
};

const decorators: Decorators<Parameter> = {
  deprecated: createDecorator(
    z.object({
      reason: z.string().optional(),
    }),
    (parameter, args) => {
      parameter.deprecated = args.reason || true;
    },
  ),
};
