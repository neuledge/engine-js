import { DocumentNode, parseDocumentNode } from './nodes';
import { TokenCursor } from './tokens';

export const parseStates = (
  source: string,
  filepath?: string,
): DocumentNode => {
  const cursor = new TokenCursor(source, filepath);
  return parseDocumentNode(cursor);
};
