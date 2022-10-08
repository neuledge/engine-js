import { DocumentDefinition } from '@neuledge/states';
import { generateState } from './state.js';

export const generate = (document: DocumentDefinition): string => {
  const res: string[] = [];

  for (const states of Object.values(document.states)) {
    for (const state of states) {
      res.push(generateState(state));
    }
  }

  return res.join('\n\n') + '\n';
};
