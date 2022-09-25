import { TokensParser } from '@/tokens/parser.js';
import { TokenType } from '@/tokens/type.js';

export interface ImportNode {
  type: 'Import';
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
      path: path.value,
    };
  } catch (error) {
    cursor.position -= 1;
    throw error;
  }
};
