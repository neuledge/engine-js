import { TokensParser } from '@/tokens/index.js';
import { AbstractNode } from './abstract.js';
import { DecoratorNode, parseDecoratorNodes } from './decorator.js';
import { DescriptionNode, parseMaybeDescriptionNode } from './description.js';
import { FieldReferenceNode } from './field-reference.js';
import { FieldNode } from './field.js';
import { parseIdentifierNode } from './identifier.js';
import { LiteralNode, parsePositiveIntegerLiteralNode } from './literal.js';
import { parseTypeNode } from './type.js';
import { parseVersionateNode, VersionateNode } from './versionate.js';

export interface StateNode extends AbstractNode<'State'> {
  id: VersionateNode;
  description?: DescriptionNode;
  from?: VersionateNode;
  fields: StateFieldNode[];
  decorators: DecoratorNode[];
}

export type StateFieldNode = FieldNode | FieldReferenceNode;

export const parseStateNode = (cursor: TokensParser): StateNode => {
  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);

  const start = cursor.start;

  cursor.consumeKeyword('state');
  const id = parseVersionateNode(cursor, true);

  const fromKeyword = cursor.maybeConsumeKeyword('from');
  let fromId;
  if (fromKeyword) {
    fromId = parseVersionateNode(cursor);
  }

  const fields = parseStateFieldNodes(cursor);

  return {
    type: 'State',
    start,
    end: cursor.end,
    id,
    description,
    from: fromId,
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

  const firstId = maybeRef
    ? parseVersionateNode(cursor)
    : parseIdentifierNode(cursor);

  const dotSign = maybeRef
    ? substractSign ||
      (firstId.type === 'Versionate' && firstId.version != null)
      ? cursor.consumePunctuation('.')
      : cursor.maybeConsumePunctuation('.')
    : undefined;

  if (!dotSign) {
    return parseFieldNode(cursor, {
      start,
      key: firstId.type !== 'Identifier' ? firstId.identifier : firstId,
      description,
      decorators,
    });
  }

  const secId = parseIdentifierNode(cursor);

  return parseFieldReferenceNode(cursor, {
    start,
    state:
      firstId.type === 'Versionate'
        ? firstId
        : {
            type: 'Versionate',
            start: firstId.start,
            end: firstId.end,
            identifier: firstId,
          },
    key: secId,
    substract: !!substractSign,
  });
};

const parseFieldNode = (
  cursor: TokensParser,
  base: Pick<FieldNode, 'key' | 'description' | 'decorators' | 'start'>,
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
  base: Pick<FieldReferenceNode, 'state' | 'key' | 'substract' | 'start'>,
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
  return parsePositiveIntegerLiteralNode(cursor);
};
