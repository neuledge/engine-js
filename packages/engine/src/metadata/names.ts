import { resolveDefer, State, StateKey } from '@/generated/index.js';
import pluralize from 'pluralize';

export type StateCollectionNames = Record<
  StateKey | `${StateKey}.${string}`,
  string
>;

export const generateStateCollectionNames = (
  states: Iterable<State>,
): StateCollectionNames => {
  const groups = getStateGroups(states);

  const suggestions: StatesNameSuggestion[] = [];
  for (const group of groups.values()) {
    suggestions.push(...suggestStatesCollectionNames(group));
  }

  suggestions.sort((a, b) => a.name.localeCompare(b.name) || b.rank - a.rank);

  const bestNames = new Map<Iterable<State>, StatesNameSuggestion>();

  for (const [index, suggestion] of suggestions.entries()) {
    // ignore name collisions and use the best suggestion first
    if (suggestions[index - 1]?.name === suggestion.name) continue;

    const best = bestNames.get(suggestion.states);
    if (best == null || best.rank < suggestion.rank) {
      bestNames.set(suggestion.states, suggestion);
    }
  }

  const names: StateCollectionNames = {};
  for (const [states, suggestion] of bestNames) {
    for (const state of states) {
      names[state.$key] = suggestion.name;
    }

    Object.assign(names, generateStateFieldNames(states));
  }

  return names;
};

const getStateGroups = (states: Iterable<State>): Set<Set<State>> => {
  const groups: Map<StateKey, Set<State>> = new Map();

  for (const state of states) {
    let set = groups.get(state.$key);
    if (!set) {
      set = new Set([state]);
      groups.set(state.$key, set);
    }

    const methods = resolveDefer(state.$methods, {});
    for (const method in methods) {
      const methodStates = methods[method];
      if (!methodStates) continue;

      for (const methodState of methodStates) {
        set.add(methodState);

        for (const item of groups.get(methodState.$key) ?? []) {
          set.add(item);
        }
      }
    }

    for (const state of set) {
      groups.set(state.$key, set);
    }
  }

  return new Set(groups.values());
};

type StatesNameSuggestion = {
  states: Iterable<State>;
  name: string;
  rank: number;
};

const suggestStatesCollectionNames = (
  states: Iterable<State>,
): StatesNameSuggestion[] => {
  const suggestions: StatesNameSuggestion[] = [];
  const phrase: string[] = [];

  let first: string[] | undefined;
  for (const state of states) {
    // split by camel case or snake case with separate numbers
    const words = state.$key
      .split(/(?=[A-Z])|_|(?<=[a-z])(?=\d)/)
      .map((word) => word.toLowerCase());

    suggestions.push({ states, name: formatCollectionName(words), rank: 0 });

    if (first == null) {
      phrase.push(...words);

      first = words;
      continue;
    }

    const wordsSet = new Set(words);

    for (let i = 0; i < phrase.length; i++) {
      if (!wordsSet.has(phrase[i])) {
        phrase.splice(i, 1);
        i--;
      }
    }
  }

  suggestions.push({
    states,
    name: formatCollectionName(phrase),
    rank: 1000,
  });

  for (let i = phrase.length - 1; i > 0; i--) {
    suggestions.push(
      {
        states,
        name: formatCollectionName(phrase.slice(i)),
        rank: (500 * phrase.length - i) / phrase.length,
      },
      {
        states,
        name: formatCollectionName(phrase.slice(0, i)),
        rank: (100 * i) / phrase.length,
      },
    );
  }

  return suggestions;
};

const formatCollectionName = (words: string[]): string =>
  [...words.slice(0, -1), pluralize.plural(words[words.length - 1])].join('_');

const generateStateFieldNames = (
  states: Iterable<State>,
): StateCollectionNames => {
  const nameMap = new Map<string, Map<string, Set<`${string}.${string}`>>>();

  for (const state of states) {
    const fields = resolveDefer(state.$scalars, {});

    for (const key in fields) {
      const { type } = fields[key];

      let name = nameMap.get(key);
      if (!name) {
        name = new Map();
        nameMap.set(key, name);
      }

      const typeKey = Array.isArray(type)
        ? `(${type.map((item) => item.$key).join('|')})`
        : type.key;

      let keys = name.get(typeKey);
      if (!keys) {
        keys = new Set();
        name.set(typeKey, keys);
      }

      keys.add(`${state.$key}.${key}`);
    }
  }

  const names: StateCollectionNames = {};
  const usedNames = new Set<string>(nameMap.keys());

  for (const [name, typeMap] of nameMap) {
    const states = [...typeMap.values()].sort((a, b) => b.size - a.size);

    for (const key of states[0]) {
      names[key] = name;
    }

    for (let i = 1; i < states.length; i++) {
      let altName;
      let j = i + 1;
      do {
        altName = `${name}_${j++}`;
      } while (usedNames.has(altName));

      usedNames.add(altName);

      for (const key of states[i]) {
        names[key] = altName;
      }
    }
  }

  return names;
};
