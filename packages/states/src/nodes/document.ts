import { Tokenizer } from '@/tokenizer';
import { AbstractNode } from './abstract';
import { parseDecoratorNodes } from './decorator';
import { parseMaybeDescriptionNode } from './description';
import { EITHER_KEYWORD, parseEitherNode } from './either';
import { EntityNode } from './entity';
import { MigrationNode } from './migration';
import { MutationNode, parseMutationNode } from './mutation';
import { parseStateNode, STATE_KEYWORD } from './state';

export interface DocumentNode extends AbstractNode<'Root'> {
  body: DocumentBodyNode[];
}

export type DocumentBodyNode = EntityNode | MigrationNode | MutationNode;

export const parseDocumentNode = (cursor: Tokenizer): DocumentNode => ({
  type: 'Root',
  path: cursor.path,
  start: cursor.start,
  body: parseDocumentBodyNodes(cursor),
  end: cursor.end,
});

const parseDocumentBodyNodes = (cursor: Tokenizer): DocumentBodyNode[] => {
  const body: DocumentBodyNode[] = [];

  while (cursor.current) {
    const description = parseMaybeDescriptionNode(cursor);
    const decorators = parseDecoratorNodes(cursor);

    const keyword = cursor.pickKeyword();
    const nodeKeyword =
      keyword && cursor.next?.type === 'Word' ? keyword.value : null;

    let node: DocumentBodyNode;

    switch (nodeKeyword) {
      case STATE_KEYWORD:
        node = parseStateNode(cursor, description, decorators);
        break;

      case EITHER_KEYWORD:
        node = parseEitherNode(cursor, description, decorators);
        break;

      default:
        if (!keyword) {
          // TODO parse migration
          throw cursor.createError();
        }

        node = parseMutationNode(cursor, description, decorators);
    }

    body.push(node);
  }

  return body;
};
