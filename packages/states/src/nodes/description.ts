import { Tokenizer } from '@/tokenizer.js';
import { AbstractNode } from './abstract.js';

export interface DescriptionNode extends AbstractNode<'Description'> {
  value: string;
}

export const parseMaybeDescriptionNode = (
  cursor: Tokenizer,
): DescriptionNode | undefined => {
  const start = cursor.start;
  const path = cursor.path;

  const strToken = cursor.maybeConsume(
    'String',
    (token) => token.kind === '"' || token.kind === '"""',
  );

  return (
    strToken && {
      type: 'Description',
      path,
      start,
      end: cursor.end,
      value: strToken.value,
    }
  );
};
