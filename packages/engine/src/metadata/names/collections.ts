import { resolveDefer, StateDefinition, StateName } from '@/definitions';
import pluralize from 'pluralize';

/**
 * Group states by collections and return a map of collection name to it's states.
 */
export const groupStatesByCollectionName = (
  states: Iterable<StateDefinition>,
): Map<string, Iterable<StateDefinition>> => {
  const groups = getStateGroups(states);

  // get all possible names for each group
  const suggestions: StatesNameSuggestion[] = [];
  for (const group of groups.values()) {
    suggestions.push(...suggestStatesCollectionNames(group));
  }

  // sort suggestions by name and rank to pick the best name for each group among all groups suggestions
  suggestions.sort((a, b) => a.name.localeCompare(b.name) || b.rank - a.rank);

  const selectedName = new Map<
    Iterable<StateDefinition>,
    StatesNameSuggestion
  >();

  // pick the best ranked name for each group
  for (const [index, suggestion] of suggestions.entries()) {
    // ignore name collisions with last suggestion
    if (suggestions[index - 1]?.name === suggestion.name) continue;

    const best = selectedName.get(suggestion.states);
    if (best == null || best.rank < suggestion.rank) {
      selectedName.set(suggestion.states, suggestion);
    }
  }

  return new Map(
    [...selectedName.entries()].map(([states, suggestion]) => [
      suggestion.name,
      states,
    ]),
  );
};

const getStateGroups = (
  states: Iterable<StateDefinition>,
): Set<Set<StateDefinition>> => {
  const groups: Map<StateName, Set<StateDefinition>> = new Map();

  for (const state of states) {
    let set = groups.get(state.$name);
    if (!set) {
      set = new Set([state]);
      groups.set(state.$name, set);
    }

    const relatedStates = resolveDefer(state.$transforms, []);
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

/**
 * Get all possible name combinations for a group of states by reusing the state
 * names and generate all common phrases between all states.
 *
 * For example, if the group contains states `PaidUser`, `PaidUserProfile` and `AvatarPaidUser`,
 * the suggestions will be:
 * - `paid_users`
 * - `users`
 * - `paid`
 * - `paid_user_profiles`
 * - `avatar_paid_users`
 */
const suggestStatesCollectionNames = (
  stateGroup: Iterable<StateDefinition>,
): StatesNameSuggestion[] => {
  const suggestions: StatesNameSuggestion[] = [];
  const sharedPhrase: string[] = [];

  let first = true;
  for (const state of stateGroup) {
    // split string to words by camel case, snake case and numbers
    const words = state.$name
      .split(/(?=[A-Z])|_|(?<=[a-z])(?=\d)/)
      .map((word) => word.toLowerCase());

    // add exact name suggestion with rank 0
    suggestions.push({
      states: stateGroup,
      name: formatCollectionName(words),
      rank: 0,
    });

    if (first) {
      sharedPhrase.push(...words);

      first = false;
      continue;
    }

    const wordsSet = new Set(words);

    // remove words that are not shared by all states
    for (let i = 0; i < sharedPhrase.length; i++) {
      if (!wordsSet.has(sharedPhrase[i])) {
        sharedPhrase.splice(i, 1);
        i--;
      }
    }
  }

  // add suggestion for the shared phrase between all states with top rank
  suggestions.push({
    states: stateGroup,
    name: formatCollectionName(sharedPhrase),
    rank: 1000,
  });

  // add suggestions for another shared phrases with lower rank
  for (let i = sharedPhrase.length - 1; i > 0; i--) {
    suggestions.push(
      {
        states: stateGroup,
        name: formatCollectionName(sharedPhrase.slice(i)),
        rank: (500 * sharedPhrase.length - i) / sharedPhrase.length,
      },
      {
        states: stateGroup,
        name: formatCollectionName(sharedPhrase.slice(0, i)),
        rank: (100 * i) / sharedPhrase.length,
      },
    );
  }

  return suggestions;
};

/**
 * Get a collection name from a list of words where the last word is pluralized.
 * For example: ['user', 'profile'] -> 'user_profiles'
 */
const formatCollectionName = (words: string[]): string =>
  [...words.slice(0, -1), pluralize.plural(words.at(-1) as string)].join('_');
