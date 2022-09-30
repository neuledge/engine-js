import { DecoratorNode } from '@/ast/index.js';
import { ParsingError } from '@/parsing-error.js';
import { NamedDefinition } from '../named.js';

export const attachDeprecatedDecorator = (
  def: Pick<NamedDefinition, 'deprecationReason'>,
  decorator: DecoratorNode,
): void => {
  const reason = decorator.arguments.find((item) => item.key.name === 'reason');

  if (!reason) {
    throw new ParsingError(
      decorator,
      `'@${decorator.callee.name}' decorator missing a required 'reason' argument`,
    );
  }

  if (typeof reason.value.value !== 'string') {
    throw new ParsingError(
      reason.value,
      `Expect string literal for 'reason' argument`,
    );
  }

  def.deprecationReason = reason.value.value;
};
