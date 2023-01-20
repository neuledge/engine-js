import { ArgumentNode, ParsingError } from '@neuledge/states-parser';

export type Arguments<V extends { node: unknown }> = Record<
  string,
  Argument<V>
>;

export interface Argument<V extends { node: unknown }> {
  type: 'Argument';
  node: ArgumentNode<V['node']>;
  name: string;
  value: V;
}

export const parseArguments = <V extends { node: unknown }>(
  nodes: ArgumentNode<V['node']>[],
  parser: (node: V['node']) => V,
): Arguments<V> => {
  const acc: Arguments<V> = {};

  for (const node of nodes) {
    if (node.key.name in acc) {
      throw new ParsingError(node.key, `Duplicate argument '${node.key.name}'`);
    }

    acc[node.key.name] = parseArgument(node, parser);
  }

  return acc;
};

const parseArgument = <V extends { node: unknown }>(
  node: ArgumentNode<V['node']>,
  parser: (node: V['node']) => V,
): Argument<V> => ({
  type: 'Argument',
  node,
  name: node.key.name,
  value: parser(node.value),
});
