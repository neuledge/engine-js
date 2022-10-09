import { Tokenizer } from '@/tokenizer.js';
import { AbstractNode } from './abstract.js';

export interface IdentifierNode extends AbstractNode<'Identifier'> {
  name: string;
}

export const parseIdentifierNode = (cursor: Tokenizer): IdentifierNode => ({
  type: 'Identifier',
  path: cursor.path,
  start: cursor.start,
  name: cursor.consume('Word', null, `identifier name`).value,
  end: cursor.end,
});
