import {
  DocumentBodyNode,
  DocumentNode,
  EitherNode,
  EntityNode,
  FieldNode,
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
import { parseState, State } from './state';
import { Void } from './void';

export class StatesContext {
  private readonly entityMap: { [K in string]?: Entity<K> } = {
    ...builtInScalars,
    Void,
  };
  private readonly fieldsMap: Partial<Record<string, FieldNode[]>> = {};
  private readonly mutationMap: Partial<
    Record<string, Partial<Record<string, Mutation>>>
  > = {};
  private parent?: StatesContext;
  private processing: { process(): unknown; order: number }[] = [];

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

  fields(stateName: string): FieldNode[] | undefined {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
    let self = this;

    do {
      const res = this.fieldsMap[stateName];
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
    Object.assign(this.fieldsMap, child.fieldsMap);

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
    order: number,
    process: () => Entity & { type: T['type']; node: T },
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
      process: () => Object.assign(ref, process()),
      order,
    });
  }

  private registerEither(node: EitherNode): void {
    this.registerEntity(node, 1, () => {
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
    this.registerEntity(node, 2, () =>
      parseState(
        this,
        node,
        this.queryStateFields(node),
        (this.mutationMap[node.id.name] ?? {}) as Record<string, Mutation>,
      ),
    );
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
      order: 3,
    });
  }

  // processors

  process(): void {
    for (const { process } of this.processing.sort(
      (a, b) => a.order - b.order,
    )) {
      process();
    }

    this.processing = [];
  }

  private queryStateFields(state: StateNode): FieldNode[] {
    if (state.id.name in this.fieldsMap) {
      const res = this.fieldsMap[state.id.name];

      if (res === undefined) {
        throw new ParsingError(state.id, `Circular dependency detected`);
      }

      return res;
    }

    this.fieldsMap[state.id.name] = undefined;
    const fieldMap = this.queryStateFrom(state);

    const sortedFields = [...state.fields].sort(
      (a, b) =>
        ('index' in a ? a.index.value : 0) - ('index' in b ? b.index.value : 0),
    );

    for (const node of sortedFields) {
      const field = this.queryStateField(node);
      if (!field) continue;

      fieldMap[node.key.name] = field;
    }

    const fields = Object.values(fieldMap);

    for (const field of fields) {
      const mutation = this.mutation(state.id.name, field.key.name);
      if (mutation) {
        throw new ParsingError(
          mutation.node.key,
          `The state '${state.id.name}' already has a field name '${field.key.name}' defined`,
        );
      }
    }

    this.fieldsMap[state.id.name] = fields;
    return fields;
  }

  private queryStateFrom(state: StateNode): Record<string, FieldNode> {
    const fieldMap: Record<string, FieldNode> = {};
    if (!state.from) return fieldMap;

    const fromState = this.entity(state.from.name);
    if (fromState?.type !== 'State') {
      throw new ParsingError(
        state.from,
        `Unknown state name '${state.from.name}'`,
      );
    }

    const fromFields = this.queryStateFields(fromState.node);
    for (const item of fromFields) {
      fieldMap[item.key.name] = {
        ...item,
        index: {
          ...item.index,
          value: item.index.value + STATE_FIELD_INDEX_MAX_INPUT_VALUE,
        },
      };
    }

    for (const item of state.fields) {
      if (!fieldMap[item.key.name]) {
        if (item.type !== 'ExcludedField') continue;

        throw new ParsingError(
          item,
          `Unknown field name '${item.key.name}' on state '${state.from.name}'`,
        );
      }

      delete fieldMap[item.key.name];
    }

    return fieldMap;
  }

  private queryStateField(node: StateFieldNode): FieldNode | null {
    switch (node.type) {
      case 'Field': {
        return node;
      }

      case 'ReferenceField': {
        const refState = this.entity(node.state.name);
        if (refState?.type !== 'State') {
          throw new ParsingError(
            node.state,
            `Unknown state name '${node.state.name}'`,
          );
        }

        let field = refState.node.fields.find(
          (field): field is FieldNode =>
            field.key.name === field.key.name && field.type === 'Field',
        );

        if (!field) {
          const refFields = this.queryStateFields(refState.node);
          field = refFields.find(({ key }) => key.name === node.key.name);

          if (!field) {
            throw new ParsingError(
              node.key,
              `Undefined field name '${node.key.name}' on state '${node.state.name}'`,
            );
          }
        }

        return { ...field, index: node.index };
      }

      case 'ExcludedField': {
        return null;
      }
    }
  }
}
