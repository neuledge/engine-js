import { StatesContext } from '@/context';
import { applyDecorators, createDecorator, Decorators } from '@/decorators';
import { MutationNode, ParsingError } from '@neuledge/states-parser';
import { z } from 'zod';
import {
  ParametersContext,
  Parameter,
  parseParametersContext,
} from '@/parameter';
import { parseProperties, Property } from '@/property';
import { State } from '@/state';
import { Either } from '@/either';
import { Void } from '@/void';

export interface Mutation extends ParametersContext {
  type: 'Mutation';
  node: MutationNode;
  name: string;
  mutation: 'create' | 'update' | 'delete';
  description?: string;
  deprecated?: boolean | string;
  target: State | Either;
  returns: State | Either | typeof Void;
  parameters: Record<string, Parameter>;
  body: Record<string, Property>;
}

export const parseMutation = (
  ctx: StatesContext,
  node: MutationNode,
): Mutation => {
  const target = parseTarget(ctx, node);
  const returns = parseReturns(ctx, node, target);

  const params = parseParametersContext(
    ctx,
    node.from ? target : null,
    node.parameters,
  );
  const body = parseBody(ctx, params, node);

  const mutation: Mutation = {
    type: 'Mutation',
    node,
    ...params,
    mutation: node.from
      ? returns.name === Void.name
        ? 'delete'
        : 'update'
      : 'create',
    name: node.key.name,
    description: node.description?.value,
    target,
    returns,
    body,
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

const parseTarget = (
  ctx: StatesContext,
  node: MutationNode,
): State | Either => {
  const targetNode = node.from ?? node.returns;
  const target = ctx.entity(targetNode.name);

  if (!target) {
    throw new ParsingError(
      targetNode,
      `Unknown entity name '${targetNode.name}'`,
    );
  }

  if (node.from) {
    if (target.type !== 'State' && target.type !== 'Either') {
      throw new ParsingError(
        targetNode,
        `Expected state or either, got '${target.type}'`,
      );
    }
  } else if (target.type !== 'State') {
    throw new ParsingError(targetNode, `Expected state, got '${target.type}'`);
  }

  return target;
};

const parseReturns = (
  ctx: StatesContext,
  node: MutationNode,
  target: State | Either,
): State | Either | typeof Void => {
  const returnsNode = node.returns;
  const returns = ctx.entity(returnsNode.name);

  if (!returns) {
    throw new ParsingError(
      returnsNode,
      `Unknown entity name '${returnsNode.name}'`,
    );
  }

  switch (returns.type) {
    case 'State':
    case 'Void': {
      break;
    }

    case 'Either': {
      if (target.type !== 'Either') {
        throw new ParsingError(
          returnsNode,
          `Expected state or void, got '${returns.type}'`,
        );
      }

      if (target.name !== returns.name) {
        throw new ParsingError(
          returnsNode,
          `Expected either '${target.name}', got '${returns.name}'`,
        );
      }
      break;
    }

    case 'Scalar': {
      throw new ParsingError(
        returnsNode,
        `Expected state or void, got '${returns.type}'`,
      );
    }
  }

  return returns;
};

const parseBody = (
  ctx: StatesContext,
  params: ParametersContext,
  node: MutationNode,
): Record<string, Property> => parseProperties(ctx, params, node.body);
