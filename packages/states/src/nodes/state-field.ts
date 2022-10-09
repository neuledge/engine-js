import { Tokenizer } from '@/tokenizer.js';
import { parseDecoratorNodes } from './decorator.js';
import { parseMaybeDescriptionNode } from './description.js';
import { ExcludedFieldNode } from './excluded-field.js';
import { ReferenceFieldNode } from './reference-field.js';
import { FieldNode } from './field.js';
import { parseIdentifierNode } from './identifier.js';
import { LiteralNode, parsePositiveIntegerLiteralNode } from './literal.js';
import { parseTypeNode } from './type.js';

export type StateFieldNode = FieldNode | ReferenceFieldNode | ExcludedFieldNode;

export const parseStateFieldNodes = (cursor: Tokenizer): StateFieldNode[] => {
  const fields: StateFieldNode[] = [];

  cursor.consumePunctuation('{');

  while (!cursor.maybeConsumePunctuation('}')) {
    fields.push(parseStateFieldNode(cursor));
  }

  return fields;
};

const parseStateFieldNode = (cursor: Tokenizer): StateFieldNode => {
  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);

  const maybeRef = !description && !decorators.length;
  const start = cursor.start;

  const substractSign = maybeRef
    ? cursor.maybeConsumePunctuation('-')
    : undefined;

  const firstId = parseIdentifierNode(cursor);
  if (substractSign) {
    return { type: 'ExcludedField', key: firstId, start, end: cursor.end };
  }

  const dotSign = maybeRef ? cursor.maybeConsumePunctuation('.') : undefined;

  if (!dotSign) {
    return parseFieldNode(cursor, {
      start,
      key: firstId,
      description,
      decorators,
    });
  }

  const secId = parseIdentifierNode(cursor);

  return parseReferenceFieldNode(cursor, {
    start,
    state: firstId,
    key: secId,
  });
};

const parseFieldNode = (
  cursor: Tokenizer,
  base: Pick<FieldNode, 'key' | 'description' | 'decorators' | 'start'>,
): FieldNode => {
  const nullSign = cursor.maybeConsumePunctuation('?');

  cursor.maybeConsumePunctuation(':');
  const valueType = parseTypeNode(cursor);
  const index = parseIndex(cursor);

  return {
    type: 'Field',
    ...base,
    path: cursor.path,
    end: cursor.end,
    valueType,
    index,
    nullable: !!nullSign,
  };
};

const parseReferenceFieldNode = (
  cursor: Tokenizer,
  base: Pick<ReferenceFieldNode, 'state' | 'key' | 'start'>,
): ReferenceFieldNode => {
  const index = parseIndex(cursor);

  return {
    type: 'ReferenceField',
    ...base,
    path: cursor.path,
    end: cursor.end,
    index,
  };
};

const parseIndex = (cursor: Tokenizer): LiteralNode<number> => {
  cursor.consumePunctuation('=');
  return parsePositiveIntegerLiteralNode(cursor);
};
