import { DocumentNode, States } from '@neuledge/states';
import { generateState } from './state.js';

export const generate = (states: States, document: DocumentNode): string => {
  const res: string[] = [];

  for (const node of document.body) {
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
