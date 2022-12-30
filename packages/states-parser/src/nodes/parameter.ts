import { TokenCursor } from '@/tokens';
import { AbstractNode } from './abstract';
import { DecoratorNode, parseDecoratorNodes } from './decorator';
import { DescriptionNode, parseMaybeDescriptionNode } from './description';
import { IdentifierNode, parseIdentifierNode } from './identifier';
import { parseTypeNode, TypeNode } from './type';

export interface ParameterNode extends AbstractNode<'Parameter'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorators: DecoratorNode[];
  as: TypeNode;
  nullable: boolean;
}

export const parseParameterNodes = (cursor: TokenCursor): ParameterNode[] => {
  const parameters: ParameterNode[] = [];

  cursor.consumePunctuation('(');

  while (!cursor.maybeConsumePunctuation(')')) {
    const parameter = parseParameterNode(cursor);
    parameters.push(parameter);

    cursor.maybeConsumePunctuation(',');
  }

  return parameters;
};

const parseParameterNode = (cursor: TokenCursor): ParameterNode => {
  const start = cursor.start;

  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);
  const key = parseIdentifierNode(cursor);
  const nullable = !!cursor.maybeConsumePunctuation('?');

  cursor.consumePunctuation(':');
  const as = parseTypeNode(cursor);

  return {
    type: 'Parameter',
    path: cursor.path,
    start,
    end: cursor.end,
    key,
    as,
    nullable,
    description,
    decorators,
  };
};
