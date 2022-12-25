import { TokenCursor } from '@/tokens';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode, parseIdentifierNode } from './identifier';
import { NamedNode } from './named';
import { parseStateFieldNodes, StateFieldNode } from './state-field';

export const STATE_KEYWORD = 'state';

export interface StateNode extends NamedNode<'State'> {
  from?: IdentifierNode;
  fields: StateFieldNode[];
}

export const parseStateNode = (
  cursor: TokenCursor,
  description?: DescriptionNode,
  decorators: DecoratorNode[] = [],
): StateNode => {
  const start = cursor.start;

  cursor.consumeKeyword(STATE_KEYWORD);
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
