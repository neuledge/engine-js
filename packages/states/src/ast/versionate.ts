import { TokensParser } from '@/tokens/index.js';
import { AbstractNode } from './abstract.js';
import { IdentifierNode, parseIdentifierNode } from './identifier.js';
import { LiteralNode, parsePositiveIntegerLiteralNode } from './literal.js';

export interface VersionateNode extends AbstractNode<'Versionate'> {
  identifier: IdentifierNode;
  version?: LiteralNode<number>;
}

export const parseVersionateNode = (
  cursor: TokensParser,
  required?: boolean,
): VersionateNode => {
  const start = cursor.start;

  const identifier = parseIdentifierNode(cursor);
  let version;

  if (required) {
    cursor.consumePunctuation('@');
    version = parsePositiveIntegerLiteralNode(cursor);
  } else {
    const versionSign = cursor.maybeConsumePunctuation('@');
    if (versionSign) {
      version = parsePositiveIntegerLiteralNode(cursor);
    }
  }

  return {
    type: 'Versionate',
    start,
    identifier,
    version,
    end: cursor.end,
  };
};
