import { EntityNode, States } from '@neuledge/states';
import { generateState } from './state';

// TODO escape conflicted helper names like `$id<>`, etc.

export const generate = (
  states: States,
  entities: Iterable<EntityNode> = states.entities(),
): string => {
  const res: string[] = [];

  for (const node of entities) {
    switch (node.type) {
      case 'State': {
        const fields = states.fields(node.id.name);
        if (!fields) {
          throw new Error(`Internal error on parsing state '${node.id.name}'`);
        }

        res.push(generateState(node, fields));
        break;
      }
    }
  }

  return res.join('\n\n') + '\n';
};
