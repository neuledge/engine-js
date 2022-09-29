import { TokensParser, TokenType } from '@/tokens/index.js';
import { AbstractNode } from './abstract.js';
import { DecoratorNode, parseDecoratorNodes } from './decorator.js';
import { DescriptionNode, parseMaybeDescriptionNode } from './description.js';
import { FieldReferenceNode } from './field-reference.js';
import { FieldNode } from './field.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { LiteralNode } from './literal.js';
import { parseTypeNode } from './type.js';

export interface StateNode extends AbstractNode<'State'> {
  identifier: IdentifierNode;
  description?: DescriptionNode;
  extends?: IdentifierNode;
  fields: StateFieldNode[];
  decorators: DecoratorNode[];
}

export type StateFieldNode = FieldNode | FieldReferenceNode;

export const parseStateNode = (cursor: TokensParser): StateNode => {
  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);

  const start = cursor.start;

  cursor.consumeKeyword('state');
  const identifier = parseIdentifierNode(cursor);

  const extendsKeyword = cursor.maybeConsumeKeyword('extends');
  let extendsId;
  if (extendsKeyword) {
    extendsId = parseIdentifierNode(cursor);
  }

  const fields = parseStateFieldNodes(cursor);

  return {
    type: 'State',
    start,
    end: cursor.end,
    identifier,
    description,
    extends: extendsId,
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

  const maybeRef = !description && !decorators.length;
  const start = cursor.start;

  const substractSign = maybeRef
    ? cursor.maybeConsumePunctuation('-')
    : undefined;

  const firstId = parseIdentifierNode(cursor);
  const dotSign = maybeRef
    ? substractSign
      ? cursor.consumePunctuation('.')
      : cursor.maybeConsumePunctuation('.')
    : undefined;

  if (!dotSign) {
    return parseFieldNode(cursor, {
      start,
      identifier: firstId,
      description,
      decorators,
    });
  }

  const secId = parseIdentifierNode(cursor);

  return parseFieldReferenceNode(cursor, {
    start,
    state: firstId,
    identifier: secId,
    substract: !!substractSign,
  });
};

const parseFieldNode = (
  cursor: TokensParser,
  base: Pick<FieldNode, 'identifier' | 'description' | 'decorators' | 'start'>,
): FieldNode => {
  const nullSign = cursor.maybeConsumePunctuation('?');

  cursor.maybeConsumePunctuation(':');
  const fieldType = parseTypeNode(cursor);
  const index = parseIndex(cursor);

  return {
    type: 'Field',
    ...base,
    end: cursor.end,
    fieldType,
    index,
    nullable: !!nullSign,
  };
};

const parseFieldReferenceNode = (
  cursor: TokensParser,
  base: Pick<
    FieldReferenceNode,
    'state' | 'identifier' | 'substract' | 'start'
  >,
): FieldReferenceNode => {
  if (base.substract) {
    return {
      type: 'FieldReference',
      ...base,
      end: cursor.end,
      substract: true,
    };
  }

  const index = parseIndex(cursor);

  return {
    type: 'FieldReference',
    ...base,
    end: cursor.end,
    substract: false,
    index,
  };
};

const parseIndex = (cursor: TokensParser): LiteralNode<number> => {
  cursor.consumePunctuation('=');

  const start = cursor.start;

  const { value } = cursor.consume(
    TokenType.NUMBER,
    ({ value }) => Number.isInteger(value) && value > 0,
    `positive interger`,
  );

  return {
    type: 'Literal',
    start,
    value,
    end: cursor.end,
  };
};
