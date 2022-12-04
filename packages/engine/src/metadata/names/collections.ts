import {
  resolveDefer,
  StateDefinition,
  StateDefinitionName,
} from '@/definitions';
import pluralize from 'pluralize';

export const getCollectionNames = (
  states: Iterable<StateDefinition>,
): Map<StateDefinitionName, string> => {
  const groups = getStateGroups(states);

  const suggestions: StatesNameSuggestion[] = [];
  for (const group of groups.values()) {
    suggestions.push(...suggestStatesCollectionNames(group));
  }

  suggestions.sort((a, b) => a.name.localeCompare(b.name) || b.rank - a.rank);

  const selectedName = new Map<
    Iterable<StateDefinition>,
    StatesNameSuggestion
  >();

  for (const [index, suggestion] of suggestions.entries()) {
    // ignore name collisions with last suggestion
    if (suggestions[index - 1]?.name === suggestion.name) continue;

    const best = selectedName.get(suggestion.states);
    if (best == null || best.rank < suggestion.rank) {
      selectedName.set(suggestion.states, suggestion);
    }
  }

  return new Map(
    [...selectedName.entries()].flatMap(([states, { name }]) =>
      [...states].map((state) => [state.$name, name]),
    ),
  );
};

const getStateGroups = (
  states: Iterable<StateDefinition>,
): Set<Set<StateDefinition>> => {
  const groups: Map<StateDefinitionName, Set<StateDefinition>> = new Map();

  for (const state of states) {
    let set = groups.get(state.$name);
    if (!set) {
      set = new Set([state]);
      groups.set(state.$name, set);
    }

    const relatedStates = resolveDefer(state.$states, []);
    for (const relatedState of relatedStates) {
      set.add(relatedState);

      for (const item of groups.get(relatedState.$name) ?? []) {
        set.add(item);
      }
    }

    for (const state of set) {
      groups.set(state.$name, set);
    }
  }

  return new Set(groups.values());
};

type StatesNameSuggestion = {
  states: Iterable<StateDefinition>;
  name: string;
  rank: number;
};

const suggestStatesCollectionNames = (
  states: Iterable<StateDefinition>,
): StatesNameSuggestion[] => {
  const suggestions: StatesNameSuggestion[] = [];
  const phrase: string[] = [];

  let first: string[] | undefined;
  for (const state of states) {
    // split by camel case or snake case with separate numbers
    const words = state.$name
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
