import { TokensParser } from '@/tokens/parser.js';
import { TokenType } from '@/tokens/type.js';
import { AbstractNode } from './abstract.js';

export interface ImportNode extends AbstractNode<'Import'> {
  path: string;
}

export const parseImportNodes = (cursor: TokensParser): ImportNode[] => {
  const nodes: ImportNode[] = [];

  for (let node; (node = parseMaybeImportNode(cursor)); ) {
    nodes.push(node);
  }

  return nodes;
};

export const parseMaybeImportNode = (
  cursor: TokensParser,
): ImportNode | undefined => {
  const start = cursor.start;
  if (!cursor.maybeConsumeKeyword('import')) {
    return undefined;
  }

  try {
    const path = cursor.consume(
      TokenType.STRING,
      ({ value }) => !!value.length,
      'import path',
    );

    return {
      type: 'Import',
      start,
      end: cursor.end,
      path: path.value,
    };
  } catch (error) {
    cursor.index -= 1;
    throw error;
  }
};
