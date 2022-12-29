import { EitherNode, ParsingError } from '@neuledge/states-parser';
import { z } from 'zod';
import { applyDecorators, createDecorator, Decorators } from './decorators';
import { State, StatesContext } from './index';

export interface Either {
  type: 'Either';
  node: EitherNode;
  name: string;
  description?: string;
  deprecated?: boolean | string;
  states: State[];
}

export const parseEither = (ctx: StatesContext, node: EitherNode): Either => {
  const either: Either = {
    type: 'Either',
    node,
    name: node.id.name,
    description: node.description?.value,
    states: node.states.map((identifier) => {
      const state = ctx.entity(identifier.name);

      if (state?.type !== 'State') {
        throw new ParsingError(
          identifier,
          `Unknown state name '${identifier.name}'`,
        );
      }

      return state;
    }),
  };

  applyDecorators(either, node.decorators, decorators);

  return either;
};

const decorators: Decorators<Either> = {
  deprecated: createDecorator(
    z.object({
      reason: z.string().optional(),
    }),
    (state, args) => {
      state.deprecated = args.reason || true;
    },
  ),
};
