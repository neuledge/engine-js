import { Tokenizer } from '@/tokenizer';
import { parseDecoratorNodes } from './decorator';
import { parseMaybeDescriptionNode } from './description';
import { IdentifierNode, parseIdentifierNode } from './identifier';
import { NamedNode } from './named';
import { parseStateFieldNodes, StateFieldNode } from './state-field';

export interface StateNode extends NamedNode<'State'> {
  from?: IdentifierNode;
  fields: StateFieldNode[];
}

export const parseStateNode = (cursor: Tokenizer): StateNode => {
  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);

  const start = cursor.start;

  cursor.consumeKeyword('state');
  const id = parseIdentifierNode(cursor);

  const fromKeyword = cursor.maybeConsumeKeyword('from');
  let from;
  if (fromKeyword) {
    from = parseIdentifierNode(cursor);
  }

  const fields = parseStateFieldNodes(cursor, !!from);

  return {
    type: 'State',
    path: cursor.path,
    start,
    end: cursor.end,
    id,
    description,
    from,
    fields,
    decorators,
  };
};
