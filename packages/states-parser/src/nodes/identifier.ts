import { TokenCursor } from '@/tokens';
import { AbstractNode } from './abstract';

export interface IdentifierNode extends AbstractNode<'Identifier'> {
  name: string;
}

export const parseIdentifierNode = (cursor: TokenCursor): IdentifierNode => ({
  type: 'Identifier',
  path: cursor.path,
  start: cursor.start,
  name: cursor.consume('Word', null, `identifier name`).value,
  end: cursor.end,
});
