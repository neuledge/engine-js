import {
  DocumentBodyNode,
  DocumentNode,
  EitherNode,
  EntityNode,
  FieldNode,
  MigrationNode,
  MutationNode,
  ParsingError,
  StateFieldNode,
  StateNode,
  STATE_FIELD_INDEX_MAX_INPUT_VALUE,
  TypeNode,
  parseStates,
} from '@neuledge/states-parser';
import { builtInScalars } from './built-in';
import { Either, parseEither } from './either';
import { Entity } from './entity';
import { parseState, State } from './state';

export class StatesContext {
  private readonly entityMap: Partial<Record<string, Entity>> = {
    ...builtInScalars,
  };
  private readonly fieldsMap: Partial<Record<string, FieldNode[]>> = {};
  private readonly mutationMap: Partial<
    Record<`${string}.${string}`, MutationNode>
  > = {};
  private readonly migrationMap: Partial<
    Record<`${string}->${string}`, MigrationNode>
  > = {};
  private parent?: StatesContext;

  // iterators

  // *scalars(): Generator<ScalarNode, void, unknown> {
  //   yield* this.entities('Scalar');
  // }

  *states(): Generator<State, void, unknown> {
    yield* this.entities('State');
  }

  // *eithers(): Generator<EitherNode, void, unknown> {
  //   yield* this.entities('Either');
  // }

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

  entity(name: string): Entity | undefined {
    // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
    let self = this;

    do {
      const res = this.entityMap[name];
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

  mutation(stateName: string, name: string): MutationNode | undefined {
    const key = `${stateName || ''}.${name}` as const;

    // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
    let self = this;

    do {
      const res = this.mutationMap[key];
      if (res) return res;
    } while ((self = self.parent as this));

    return undefined;
  }

  migration(origin: string, target: string): MigrationNode | undefined {
    const key = `${origin}->${target}` as const;

    // eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
    let self = this;

    do {
      const res = this.migrationMap[key];
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

    // then process the entities and mutations
    for (const document of documents) {
      for (const item of document.body) {
        child.process(item);
      }
    }

    // success! embed the child context within the current one
    this.embed(child);

    return documents;
  }

  private embed(child: StatesContext): void {
    Object.assign(this.entityMap, child.entityMap);
    Object.assign(this.fieldsMap, child.fieldsMap);
    Object.assign(this.mutationMap, child.mutationMap);
    Object.assign(this.migrationMap, child.migrationMap);
  }

  // registerers

  register(node: DocumentBodyNode): void {
    switch (node.type) {
      case 'Either':
      case 'Scalar':
      case 'State': {
        this.registerEntity(node);
        break;
      }

      case 'Mutation': {
        this.registerMutation(node);
        break;
      }

      case 'Migration': {
        this.registerMigration(node);
        break;
      }

      default: {
        // @ts-expect-error `node.type` should be never
        throw new Error(`Unsupported document node '${node.type}'`);
      }
    }
  }

  private registerEntity(node: EntityNode): void {
    const { name } = node.id;

    if (this.entity(name)) {
      throw new ParsingError(
        node.id,
        `An entity name '${name}' already defined`,
      );
    }

    const ref: Pick<Entity, 'type' | 'node'> = { type: node.type, node };

    this.entityMap[name] = ref as Entity;
  }

  private registerMutation(node: MutationNode): void {
    const form = node.from ?? node.returns;

    if (this.mutation(form.name, node.key.name)) {
      throw new ParsingError(
        node.key,
        `The mutation name '${node.key.name}'${
          node.from ? ` for state '${node.from.name}'` : ''
        } already defined`,
      );
    }
    this.mutationMap[`${form.name || ''}.${node.key.name}`] = node;
  }

  private registerMigration(node: MigrationNode): void {
    if (this.migration(node.origin.name, node.returns.name)) {
      throw new ParsingError(
        node.origin,
        `A migration from state '${node.origin.name}' to state '${node.returns.name}' already defined`,
      );
    }

    this.migrationMap[`${node.origin.name}->${node.returns.name}`] = node;
  }

  // processors

  process(node: DocumentBodyNode): void {
    switch (node.type) {
      case 'Scalar': {
        // TODO process expression
        break;
      }

      case 'State': {
        this.processState(node);
        break;
      }

      case 'Either': {
        this.processEither(node);
        break;
      }

      case 'Migration': {
        // TODO process state names
        // TODO process body
        break;
      }

      case 'Mutation': {
        // TODO process state names
        // TODO process body
        break;
      }

      default: {
        // @ts-expect-error `node` should be never
        throw new Error(`Unsupported node type: '${node.type}'`);
      }
    }
  }

  private processState(state: StateNode): void {
    if (state.id.name in this.fieldsMap) {
      return;
    }

    // FIXME simplify processing and verify inner references using the `parseState` function

    this.fieldsMap[state.id.name] = undefined;
    const fields = this.queryStateFields(state);

    this.fieldsMap[state.id.name] = fields;

    Object.assign(
      this.entityMap[state.id.name] as State,
      parseState(this, state, fields),
    );
  }

  private queryStateFields(state: StateNode): FieldNode[] {
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
          mutation.key,
          `The state '${state.id.name}' already has a field name '${field.key.name}' defined`,
        );
      }
    }

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

    this.processState(fromState.node);

    const fromFields = this.fieldsMap[fromState.node.id.name];
    if (!fromFields) {
      throw new ParsingError(state.from, `Circular dependency detected`);
    }

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
        this.processType(node.as);
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
          this.processState(refState.node);

          const refFields = this.fieldsMap[refState.node.id.name];
          if (!refFields) {
            throw new ParsingError(node.state, `Circular dependency detected`);
          }
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

  private processEither(node: EitherNode): void {
    Object.assign(
      this.entityMap[node.id.name] as Either,
      parseEither(this, node),
    );
  }

  private processType(node: TypeNode): void {
    if (!this.entity(node.identifier.name)) {
      throw new ParsingError(
        node.identifier,
        `Unknown type name '${node.identifier.name}'`,
      );
    }
  }
}
