import { Tokenizer } from '@/tokenizer.js';
import { AbstractNode } from './abstract.js';
import { EntityNode } from './entity.js';
import { ImportNode, parseImportNodes } from './import.js';
import { MigrationNode } from './migration.js';
import { MutationNode } from './mutation.js';
import { parseStateNode } from './state.js';

export interface DocumentNode extends AbstractNode<'Root'> {
  imports: ImportNode[];
  body: DocumentBodyNode[];
}

export type DocumentBodyNode = EntityNode | MigrationNode | MutationNode;

export const parseDocumentNode = (cursor: Tokenizer): DocumentNode => ({
  type: 'Root',
  path: cursor.path,
  start: cursor.start,
  imports: parseImportNodes(cursor),
  body: parseDocumentBodyNodes(cursor),
  end: cursor.end,
});

const parseDocumentBodyNodes = (cursor: Tokenizer): DocumentBodyNode[] => {
  const body: DocumentBodyNode[] = [];

  while (cursor.current) {
    body.push(parseStateNode(cursor));
  }

  return body;
};
