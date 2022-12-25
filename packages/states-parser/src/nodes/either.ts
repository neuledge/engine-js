import { TokenCursor } from '@/tokens';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode, parseIdentifierNode } from './identifier';
import { NamedNode } from './named';

export const EITHER_KEYWORD = 'either';

export interface EitherNode extends NamedNode<'Either'> {
  states: IdentifierNode[];
}

export const parseEitherNode = (
  cursor: TokenCursor,
  description?: DescriptionNode,
  decorators: DecoratorNode[] = [],
): EitherNode => {
  const start = cursor.start;

  cursor.consumeKeyword(EITHER_KEYWORD);
  const id = parseIdentifierNode(cursor);

  cursor.consumePunctuation('=');
  const states = parseEitherStateNodes(cursor);

  return {
    type: 'Either',
    path: cursor.path,
    start,
    end: cursor.end,
    id,
    description,
    decorators,
    states,
  };
};

const parseEitherStateNodes = (cursor: TokenCursor): IdentifierNode[] => {
  const states: IdentifierNode[] = [];

  do {
    const state = parseIdentifierNode(cursor);
    states.push(state);
  } while (cursor.maybeConsumePunctuation('|'));

  return states;
};
