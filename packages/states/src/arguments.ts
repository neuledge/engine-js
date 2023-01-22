import { ArgumentNode, ParsingError } from '@neuledge/states-parser';

export type Arguments<T extends { node?: unknown }> = Record<
  string,
  Argument<T>
>;

export interface Argument<T extends { node?: unknown }> {
  type: 'Argument';
  node: ArgumentNode<T['node']>;
  name: string;
  value: T;
}

export const parseArguments = <T extends { node: unknown }>(
  nodes: ArgumentNode<T['node']>[],
  parser: (node: T['node']) => T,
): Arguments<T> => {
  const acc: Arguments<T> = {};

  for (const node of nodes) {
    if (node.key.name in acc) {
      throw new ParsingError(node.key, `Duplicate argument '${node.key.name}'`);
    }

    acc[node.key.name] = parseArgument(node, parser);
  }

  return acc;
};

const parseArgument = <T extends { node: unknown }>(
  node: ArgumentNode<T['node']>,
  parser: (node: T['node']) => T,
): Argument<T> => ({
  type: 'Argument',
  node,
  name: node.key.name,
  value: parser(node.value),
});
