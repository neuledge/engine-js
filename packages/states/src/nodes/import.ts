import { Tokenizer } from '@/tokenizer.js';
import { AbstractNode } from './abstract.js';
import { LiteralNode, parseLiteralNode } from './literal.js';

export interface ImportNode extends AbstractNode<'Import'> {
  source: LiteralNode<string>;
}

export const parseImportNodes = (cursor: Tokenizer): ImportNode[] => {
  const nodes: ImportNode[] = [];

  for (let node; (node = parseMaybeImportNode(cursor)); ) {
    nodes.push(node);
  }

  return nodes;
};

export const parseMaybeImportNode = (
  cursor: Tokenizer,
): ImportNode | undefined => {
  const start = cursor.start;
  if (!cursor.maybeConsumeKeyword('import')) {
    return undefined;
  }

  try {
    const source = parseLiteralNode(
      cursor,
      (cursor) =>
        cursor.consume(
          'String',
          ({ value, kind }) => kind !== '"""' && value.length > 0,
          'import path',
        ).value,
    );

    return {
      type: 'Import',
      path: cursor.path,
      start,
      end: cursor.end,
      source,
    };
  } catch (error) {
    cursor.index -= 1;
    throw error;
  }
};
