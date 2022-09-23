import { TokensParser, TokenType } from '@/tokens/index.js';
import { DecoratorNode, parseDecoratorNodes } from './decorator.js';
import { DescriptionNode, parseMaybeDescriptionNode } from './description.js';
import { FieldReferenceNode } from './field-reference.js';
import { FieldNode } from './field.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { parseTypeNode, TypeNode } from './type.js';

export interface StateNode {
  type: 'State';
  identifier: IdentifierNode;
  description?: DescriptionNode;
  fields: StateFieldNode[];
  decorators: DecoratorNode[];
}

export type StateFieldNode = FieldNode | FieldReferenceNode;

export const parseStateNode = (cursor: TokensParser): StateNode => {
  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);

  cursor.consumeKeyword('state');

  const identifier = parseIdentifierNode(cursor);

  const fields = parseStateFieldNodes(cursor);

  return {
    type: 'State',
    identifier,
    description,
    fields,
    decorators,
  };
};

const parseStateFieldNodes = (cursor: TokensParser): StateFieldNode[] => {
  const fields: StateFieldNode[] = [];

  cursor.consumePunctuation('{');
  do {
    fields.push(parseStateFieldNode(cursor));
  } while (!cursor.maybeConsumePunctuation('}'));

  return fields;
};

const parseStateFieldNode = (cursor: TokensParser): StateFieldNode => {
  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);

  let maybeRef = !description && !decorators.length;

  const refSign = maybeRef
    ? cursor.maybeConsume(
        TokenType.PUNCTUATION,
        ({ kind }) => kind === '+' || kind === '-',
      )
    : undefined;

  const firstId = parseIdentifierNode(cursor);
  const dotSign = maybeRef ? cursor.maybeConsumePunctuation('.') : undefined;
  const secId = dotSign ? parseIdentifierNode(cursor) : undefined;

  let fieldType: TypeNode | undefined;
  if (!refSign && !secId) {
    const typeSign = cursor.maybeConsumePunctuation(':');
    if (typeSign) maybeRef = false;

    fieldType = parseTypeNode(cursor);
  }

  const indexSign = maybeRef
    ? cursor.maybeConsumePunctuation('=')
    : cursor.consumePunctuation('=');

  let index: number | undefined;
  if (indexSign) {
    index = cursor.consume(
      TokenType.NUMBER,
      ({ value }) => Number.isInteger(value) && value > 0,
      `index number`,
    ).value;
  }

  return fieldType && index
    ? {
        type: 'Field',
        identifier: firstId,
        description,
        decorators,
        fieldType,
        index,
        nullable: false,
      }
    : {
        type: 'FieldReference',
        state: firstId,
        identifier: secId,
        index,
        substract: refSign?.kind === '-',
      };
};
