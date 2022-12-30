import { Void } from '@/built-in';
import { StatesContext } from '@/context';
import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { Either, State } from '@/index';
import { MutationNode, ParsingError } from '@neuledge/states-parser';
import { z } from 'zod';
import { Parameter, parseParameters } from '@/parameter';

export interface Mutation {
  type: 'Mutation';
  node: MutationNode;
  name: string;
  mutation: 'create' | 'update' | 'delete';
  description?: string;
  deprecated?: boolean | string;
  target: State | Either;
  returns: State | typeof Void;
  parameters: Record<string, Parameter>;
  body: [];
}

export const parseMutation = (
  ctx: StatesContext,
  node: MutationNode,
): Mutation => {
  const targetNode = node.from ?? node.returns;
  const target = ctx.entity(targetNode.name);
  if (!target) {
    throw new ParsingError(
      targetNode,
      `Unknown state name '${targetNode.name}'`,
    );
  }
  if (target.type !== 'State' && target.type !== 'Either') {
    throw new ParsingError(
      targetNode,
      `Expected state or either, got '${target.type}'`,
    );
  }

  const returns = ctx.entity(node.returns.name);
  if (!returns || (returns.type !== 'State' && returns.type !== 'Void')) {
    throw new ParsingError(
      node.returns,
      `Unknown state name '${node.returns.name}'`,
    );
  }

  const mutation: Mutation = {
    type: 'Mutation',
    node,
    mutation: node.from
      ? node.returns.name === Void.name
        ? 'delete'
        : 'update'
      : 'create',
    name: node.key.name,
    description: node.description?.value,
    target,
    returns,
    parameters: parseParameters(ctx, node.parameters),
    body: [],
  };

  applyDecorators(mutation, node.decorators, decorators);

  return mutation;
};

const decorators: Decorators<Mutation> = {
  deprecated: createDecorator(
    z.object({
      reason: z.string().optional(),
    }),
    (state, args) => {
      state.deprecated = args.reason || true;
    },
  ),
};
