import {
  ArgumentNode,
  DecoratorNode,
  LiteralNode,
  ParsingError,
} from '@neuledge/states-parser';
import z from 'zod';

export type Decorators<T> = Record<string, Decorator<T>>;
export type Decorator<T> = (target: T, args: DecoratorNode) => void;

export const createDecorator =
  <T, A extends z.AnyZodObject>(
    decoratorArgs: A,
    decorator: (
      target: T,
      args: z.infer<A>,
      argNodes: Record<string, ArgumentNode<LiteralNode>>,
    ) => T | void,
  ): Decorator<T> =>
  (target, node) => {
    const argsNodes = Object.fromEntries(
      node.arguments.map((arg) => [arg.key.name, arg]),
    );

    const argsValues = Object.fromEntries(
      Object.entries(argsNodes).map(([key, value]) => [
        key,
        value.value?.value,
      ]),
    );

    const args = decoratorArgs.safeParse(argsValues);
    if (!args.success) {
      const [issue] = args.error.issues;
      const key = issue.path[0];

      throw new ParsingError(
        argsNodes[key] ?? node.callee,
        `Invalid '@${node.callee.name}()' decorator on argument '${key}': ${issue.message}`,
      );
    }

    return decorator(target, args.data, argsNodes);
  };

export const applyDecorators = <T>(
  target: T,
  nodes: DecoratorNode[],
  decorators: Decorators<T>,
): void => {
  for (const node of nodes) {
    const { name } = node.callee;
    const decorator = decorators[name];

    if (decorator) {
      decorator(target, node);
    }
  }
};
