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
  returns: State | typeof Void;
  parameters: Record<string, Parameter>;
  body: Record<string, Property>;
}

export const parseMutation = (
  ctx: StatesContext,
  node: MutationNode,
): Mutation => {
  const target = parseTarget(ctx, node);
  const returns = parseReturns(ctx, node);

  const params = parseParametersContext(
    ctx,
    node.from ? target : null,
    node.parameters,
  );
  const body = parseBody(ctx, params, target, node);

  const mutation: Mutation = {
    type: 'Mutation',
    node,
    ...params,
    mutation: node.from
      ? node.returns.name === Void.name
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
): State | typeof Void => {
  const returnsNode = node.returns;
  const returns = ctx.entity(returnsNode.name);

  if (!returns) {
    throw new ParsingError(
      returnsNode,
      `Unknown entity name '${returnsNode.name}'`,
    );
  }

  if (returns.type !== 'State' && returns.type !== 'Void') {
    throw new ParsingError(
      returnsNode,
      `Expected state or void, got '${returns.type}'`,
    );
  }

  return returns;
};

const parseBody = (
  ctx: StatesContext,
  params: ParametersContext,
  target: State | Either,
  node: MutationNode,
): Record<string, Property> => {
  let body = parseProperties(ctx, params, node.body);

  if (!node.from) {
    body = { ...initializeBody(target as State), ...body };
  }

  return body;
};

const initializeBody = (state: State): Record<string, Property> => {
  const body: Record<string, Property> = {};

  for (const field of Object.values(state.fields)) {
    if (field.type === 'RelationField') continue;

    body[field.name] = {
      type: 'Property',
      name: field.name,
      value: {
        type: 'Literal',
        value: null,
      },
    };
  }

  return body;
};
