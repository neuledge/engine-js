import { TokenCursor } from '@/tokens';
import { AbstractNode } from './abstract';
import { DecoratorNode } from './decorator';
import { DescriptionNode } from './description';
import { IdentifierNode, parseIdentifierNode } from './identifier';
import { parseTypeNode, TypeNode } from './type';

export interface ParameterNode extends AbstractNode<'Parameter'> {
  key: IdentifierNode;
  description?: DescriptionNode;
  decorations: DecoratorNode[];
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
    decorations: [],
  };
};
