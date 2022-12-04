import { Tokenizer } from '@/tokenizer';
import { AbstractNode } from './abstract';
import { EntityNode } from './entity';
import { ImportNode, parseImportNodes } from './import';
import { MigrationNode } from './migration';
import { MutationNode } from './mutation';
import { parseStateNode } from './state';

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
