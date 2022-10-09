import { Tokenizer } from '@/tokenizer.js';
import { parseDecoratorNodes } from './decorator.js';
import { parseMaybeDescriptionNode } from './description.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { NamedNode } from './named.js';
import { parseStateFieldNodes, StateFieldNode } from './state-field.js';

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

  const fields = parseStateFieldNodes(cursor);

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
