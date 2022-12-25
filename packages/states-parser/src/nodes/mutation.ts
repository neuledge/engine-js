import { TokenCursor } from '@/tokens';
import { AbstractNode } from './abstract';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode, parseIdentifierNode } from './identifier';
import { ParameterNode, parseParameterNodes } from './parameter';
import { parseReturnBodyNodes, ReturnBodyNode } from './property';

export interface MutationNode extends AbstractNode<'Mutation'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  from?: IdentifierNode;
  parameters: ParameterNode[];
  returns: IdentifierNode;
  body: ReturnBodyNode[];
}

export const parseMutationNode = (
  cursor: TokenCursor,
  description?: DescriptionNode,
  decorators: DecoratorNode[] = [],
): MutationNode => {
  const start = cursor.start;

  const firstId = parseIdentifierNode(cursor);
  const secondId = cursor.maybeConsumePunctuation('.')
    ? parseIdentifierNode(cursor)
    : undefined;

  const parameters = parseParameterNodes(cursor);

  cursor.consumePunctuation(':');
  const returns = parseIdentifierNode(cursor);

  const hasBody = cursor.maybeConsumePunctuation('=>');
  const body = hasBody ? parseReturnBodyNodes(cursor) : [];

  return {
    type: 'Mutation',
    path: cursor.path,
    start,
    end: cursor.end,
    key: secondId || firstId,
    description,
    decorators,
    from: secondId ? firstId : undefined,
    parameters,
    returns,
    body,
  };
};
