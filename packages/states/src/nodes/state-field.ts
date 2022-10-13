import { Tokenizer } from '@/tokenizer.js';
import { parseDecoratorNodes } from './decorator.js';
import { parseMaybeDescriptionNode } from './description.js';
import { ExcludedFieldNode } from './excluded-field.js';
import { ReferenceFieldNode } from './reference-field.js';
import { FieldNode } from './field.js';
import { parseIdentifierNode } from './identifier.js';
import { LiteralNode, parsePositiveIntegerLiteralNode } from './literal.js';
import { parseTypeNode } from './type.js';
import { ParsingError } from '@/parsing-error.js';

export type StateFieldNode = FieldNode | ReferenceFieldNode | ExcludedFieldNode;

export const parseStateFieldNodes = (
  cursor: Tokenizer,
  hasParent?: boolean,
): StateFieldNode[] => {
  const fieldMap: Record<string, StateFieldNode> = {};
  const indexMap: Record<number, StateFieldNode> = {};

  cursor.consumePunctuation('{');

  while (!cursor.maybeConsumePunctuation('}')) {
    const field = parseStateFieldNode(cursor);

    if (fieldMap[field.key.name]) {
      throw new ParsingError(
        field.key,
        `Duplicate field name '${field.key.name}'`,
      );
    }

    if (!hasParent && field.type === 'ExcludedField') {
      throw new ParsingError(
        field,
        `Unexpected excluded field on state without a parent state`,
      );
    }

    if ('index' in field) {
      if (indexMap[field.index.value]) {
        throw new ParsingError(
          field.index,
          `Duplicate index for field name '${
            indexMap[field.index.value].key.name
          }'`,
        );
      }

      indexMap[field.index.value] = field;
    }

    fieldMap[field.key.name] = field;
  }

  return Object.values(fieldMap);
};

const parseStateFieldNode = (cursor: Tokenizer): StateFieldNode => {
  const description = parseMaybeDescriptionNode(cursor);
  const decorators = parseDecoratorNodes(cursor);

  const maybeRef = !description && !decorators.length;
  const start = cursor.start;
  const path = cursor.path;

  const substractSign = maybeRef
    ? cursor.maybeConsumePunctuation('-')
    : undefined;

  const firstId = parseIdentifierNode(cursor);
  if (substractSign) {
    return {
      type: 'ExcludedField',
      key: firstId,
      path,
      start,
      end: cursor.end,
    };
  }

  const dotSign = maybeRef ? cursor.maybeConsumePunctuation('.') : undefined;

  if (!dotSign) {
    return parseFieldNode(cursor, {
      path,
      start,
      key: firstId,
      description,
      decorators,
    });
  }

  const secId = parseIdentifierNode(cursor);

  return parseReferenceFieldNode(cursor, {
    path,
    start,
    state: firstId,
    key: secId,
  });
};

const parseFieldNode = (
  cursor: Tokenizer,
  base: Pick<
    FieldNode,
    'key' | 'description' | 'decorators' | 'path' | 'start'
  >,
): FieldNode => {
  const nullSign = cursor.maybeConsumePunctuation('?');

  cursor.maybeConsumePunctuation(':');
  const valueType = parseTypeNode(cursor);
  const index = parseIndex(cursor);

  return {
    type: 'Field',
    ...base,
    end: cursor.end,
    valueType,
    index,
    nullable: !!nullSign,
  };
};

const parseReferenceFieldNode = (
  cursor: Tokenizer,
  base: Pick<ReferenceFieldNode, 'state' | 'key' | 'path' | 'start'>,
): ReferenceFieldNode => {
  const index = parseIndex(cursor);

  return {
    type: 'ReferenceField',
    ...base,
    end: cursor.end,
    index,
  };
};

const parseIndex = (cursor: Tokenizer): LiteralNode<number> => {
  cursor.consumePunctuation('=');
  return parsePositiveIntegerLiteralNode(cursor);
};
