import { TokenCursor } from '@/tokens';
import { parseDecoratorNodes } from './decorator';
import { parseMaybeDescriptionNode } from './description';
import { ExcludedFieldNode } from './excluded-field';
import { ReferenceFieldNode } from './reference-field';
import { FieldNode } from './field';
import { parseIdentifierNode } from './identifier';
import { LiteralNode, parseUInt8LiteralNode } from './literal';
import { parseTypeNode } from './type';
import { ParsingError } from '@/error';

export const STATE_FIELD_INDEX_MAX_INPUT_VALUE = 255;

export type StateFieldNode = FieldNode | ReferenceFieldNode | ExcludedFieldNode;

export const parseStateFieldNodes = (
  cursor: TokenCursor,
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

    cursor.maybeConsumePunctuation(',');
  }

  return Object.values(fieldMap);
};

const parseStateFieldNode = (cursor: TokenCursor): StateFieldNode => {
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
  cursor: TokenCursor,
  base: Pick<
    FieldNode,
    'key' | 'description' | 'decorators' | 'path' | 'start'
  >,
): FieldNode => {
  const nullSign = cursor.maybeConsumePunctuation('?');

  cursor.maybeConsumePunctuation(':');
  const as = parseTypeNode(cursor);
  const index = parseIndex(cursor);

  return {
    type: 'Field',
    ...base,
    end: cursor.end,
    as,
    index,
    nullable: !!nullSign,
  };
};

const parseReferenceFieldNode = (
  cursor: TokenCursor,
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

const parseIndex = (cursor: TokenCursor): LiteralNode<number> => {
  cursor.consumePunctuation('=');
  return parseUInt8LiteralNode(cursor);
};
