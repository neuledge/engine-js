import {
  DocumentBodyNode,
  DocumentNode,
  EitherNode,
  EntityNode,
  MutationNode,
  ParsingError,
  StateFieldNode,
  StateNode,
  STATE_FIELD_INDEX_MAX_INPUT_VALUE,
  parseStates,
} from '@neuledge/states-parser';
import { Either, parseEither } from './either';
import { Entity } from './entity';
import { Mutation, parseMutation } from './mutation';
import { builtInScalars, CustomScalar } from './scalar';
import {
  isStateIndexEquals,
  parseState,
  parseStateField,
  State,
  StateField,
} from './state';
import { Void } from './void';

/**
 * The order in which the context processes its entities.
 */
enum ProcessingOrder {
  Eithers = 1,
  States = 2,
  Mutations = 3,
  Transforms = 4,
}

export class StatesContext {
  private readonly entityMap: { [K in string]?: Entity<K> } = {
    ...builtInScalars,
    Void,
  };
  private readonly mutationMap: Partial<
    Record<string, Partial<Record<string, Mutation>>>
  > = {};
  private parent?: StatesContext;
  private processing: { process(): unknown; order: ProcessingOrder }[] = [];

  // iterators

  *scalars(): Generator<CustomScalar, void, unknown> {
    yield* this.entities('Scalar');
  }

  *states(): Generator<State, void, unknown> {
    yield* this.entities('State');
  }

  *eithers(): Generator<Either, void, unknown> {
    yield* this.entities('Either');
  }

  *entities<T extends Entity['type']>(
    type?: T | null,
  ): Generator<Entity & { type: T }, void, unknown> {
    for (const key in this.entityMap) {
      const entity = this.entityMap[key];

      if (type == null || entity?.type === type) {
        yield entity as Entity & { type: T };
      }
    }
  }

  // getters

  entity<N extends string>(name: N): Entity<N> | undefined {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
    let self = this;

    do {
      const res = this.entityMap[name] as Entity<N> | undefined;
      if (res) return res;
    } while ((self = self.parent as this));

    return undefined;
  }

  mutation(stateName: string, name: string): Mutation | undefined {
    const key = `${stateName || ''}.${name}` as const;

    // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
    let self = this;

    do {
      const res = this.mutationMap[key]?.[name];
      if (res) return res;
    } while ((self = self.parent as this));

    return undefined;
  }

  // executors

  async exec(source: string, filepath?: string): Promise<DocumentNode> {
    const [document] = await this.load([{ source, filepath }]);
    return document;
  }

  async load(
    inputs: { source: string; filepath?: string }[],
  ): Promise<DocumentNode[]> {
    const documents = inputs.map(({ source, filepath }) =>
      parseStates(source, filepath),
    );

    // we will execute the documents on a child context and only if no errors
    // triggered we will embed it within the current parser
    const child = new StatesContext();
    child.parent = this;

    // first load all the entities and mutations
    for (const document of documents) {
      for (const item of document.body) {
        child.register(item);
      }
    }

    // then process the registered nodes by order
    child.process();

    // success! embed the child context within the current one
    this.embed(child);

    return documents;
  }

  private embed(child: StatesContext): void {
    Object.assign(this.entityMap, child.entityMap);

    Object.assign(
      this.mutationMap,
      Object.fromEntries(
        Object.entries(child.mutationMap).map(([key, value]) => [
          key,
          Object.assign(this.mutationMap[key] ?? {}, value),
        ]),
      ),
    );
  }

  // registerers

  register(node: DocumentBodyNode): void {
    switch (node.type) {
      case 'Either': {
        this.registerEither(node);
        break;
      }

      case 'Scalar': {
        // TODO implement scalars
        break;
      }

      case 'State': {
        this.registerState(node);
        break;
      }

      case 'Mutation': {
        this.registerMutation(node);
        break;
      }

      case 'Migration': {
        // TODO implement migrations
        break;
      }

      default: {
        // @ts-expect-error `node.type` should be never
        throw new Error(`Unsupported document node '${node.type}'`);
      }
    }
  }

  private registerEntity<T extends EntityNode>(
    node: T,
    order: ProcessingOrder,
    process: (ref: object) => Entity & { type: T['type']; node: T },
  ): void {
    const { name } = node.id;

    if (this.entity(name)) {
      throw new ParsingError(
        node.id,
        `An entity name '${name}' already defined`,
      );
    }

    const ref: Pick<Entity, 'type' | 'node'> = { type: node.type, node };
    this.entityMap[name] = ref as Entity;

    this.processing.push({
      process: () => Object.assign(ref, process(ref)),
      order,
    });
  }

  private registerEither(node: EitherNode): void {
    this.registerEntity(node, ProcessingOrder.Eithers, () => {
      const mutations = this.mutationMap[node.id.name] ?? {};

      for (const state of node.states) {
        const stateMutations = this.mutationMap[state.name];
        if (!stateMutations) continue;

        Object.assign(stateMutations, mutations);
      }

      return parseEither(this, node);
    });
  }

  private registerState(node: StateNode): void {
    this.registerEntity(node, ProcessingOrder.States, (ref) => {
      const fields: State['fields'] = {};
      const baseIndex = this.assignStateFields(node, ref, fields);
      const mutations = this.mutationMap[node.id.name] ?? {};

      return parseState(
        node,
        fields,
        mutations as Record<string, Mutation>,
        baseIndex,
      );
    });

    this.processing.push({
      process: () => {
        const state = this.entity(node.id.name) as State;
        const mutations = this.mutationMap[node.id.name] ?? {};

        for (const mutation of Object.values(mutations)) {
          if (mutation?.mutation !== 'update') continue;

          const transformed = mutation.returns as State;
          if (transformed.name !== state.name) continue;

          if (
            !isStateIndexEquals(
              state,
              state.primaryKey,
              transformed,
              transformed.primaryKey,
            )
          ) {
            throw new ParsingError(
              mutation.node.key,
              `A mutation for state '${state.name}' must return a state with the same primary key as the original state`,
            );
          }
        }
      },
      order: ProcessingOrder.Transforms,
    });
  }

  private registerMutation(node: MutationNode): void {
    const form = node.from ?? node.returns;

    if (this.mutation(form.name, node.key.name)) {
      throw new ParsingError(
        node.key,
        `The mutation name '${node.key.name}'${
          node.from ? ` for '${node.from.name}'` : ''
        } already defined`,
      );
    }

    let entry = this.mutationMap[form.name];
    if (!entry) {
      entry = {};
      this.mutationMap[form.name] = entry;
    }

    const ref: Pick<Mutation, 'type' | 'node'> = { type: node.type, node };
    entry[node.key.name] = ref as Mutation;

    this.processing.push({
      process: () => Object.assign(ref, parseMutation(this, node)),
      order: ProcessingOrder.Mutations,
    });
  }

  // processors

  process(): void {
    this.processing.sort((a, b) => a.order - b.order);

    for (const { process } of this.processing) {
      process();
    }

    this.processing = [];
  }

  /**
   * Assign the given `fields` dictionary with the fields of the given `node` state.
   * Return the calculated base index of the state.
   */
  private assignStateFields(
    node: StateNode,
    ref: Partial<State>,
    fields: State['fields'],
  ): number {
    // return the cached fields if already processed
    if ('fields' in ref) {
      if (ref.baseIndex == null || ref.fields == null) {
        throw new ParsingError(node.id, `Circular dependency detected`);
      }

      Object.assign(fields, ref.fields);

      return ref.baseIndex;
    }

    // mark the state as processing (to detect circular dependencies)
    ref.fields = undefined;
    let baseIndex = 0;

    // if the state has a parent, we need to parse its fields first
    if (node.from) {
      const parent = this.entity(node.from.name);

      if (parent?.type !== 'State') {
        throw new ParsingError(
          node.from,
          `Unknown state name '${node.from.name}'`,
        );
      }

      baseIndex +=
        this.assignStateFields(parent.node, parent, fields) +
        STATE_FIELD_INDEX_MAX_INPUT_VALUE;
    }

    // we will sort the fields by their index
    const sortedFields = [...node.fields].sort(
      (a, b) =>
        ('index' in a ? a.index.value : 0) - ('index' in b ? b.index.value : 0),
    );

    for (const fieldNode of sortedFields) {
      const field = this.parseStateField(fieldNode, baseIndex);

      if (!field) {
        // field marked as excluded

        if (!fields[fieldNode.key.name]) {
          throw new ParsingError(
            fieldNode.key,
            `Unknown field name '${fieldNode.key.name}'`,
          );
        }

        delete fields[fieldNode.key.name];
        continue;
      }

      fields[field.name] = field;
    }

    // mark the state as processed
    ref.fields = fields;
    ref.baseIndex = baseIndex;

    return baseIndex;
  }

  private parseStateField(
    node: StateFieldNode,
    baseIndex: number,
  ): StateField | null {
    switch (node.type) {
      case 'Field': {
        return parseStateField(this, node, baseIndex);
      }

      case 'ReferenceField': {
        const refState = this.entity(node.state.name);
        if (refState?.type !== 'State') {
          throw new ParsingError(
            node.state,
            `Unknown state name '${node.state.name}'`,
          );
        }
        const fields: State['fields'] = {};
        this.assignStateFields(refState.node, refState, fields);

        const field = fields[node.key.name];
        if (!field) {
          throw new ParsingError(
            node.key,
            `Undefined field name '${node.key.name}' on state '${node.state.name}'`,
          );
        }

        return {
          ...field,
          index: node.index.value + baseIndex,
        };
      }

      case 'ExcludedField': {
        return null;
      }
    }
  }
}
